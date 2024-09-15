import Ajv, { JTDDataType } from 'ajv/dist/jtd.js';
import { BrowserContext, BrowserContextOptions, Page, Response } from 'playwright';
import { firefox } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

import logger from './logger.js';
import { getUserAgent, isAccessDenied } from './utils.js';

firefox.use(
    stealth({
        enabledEvasions: new Set([
            'chrome.app',
            'chrome.csi',
            'chrome.loadTimes',
            'chrome.runtime',
            'defaultArgs',
            'iframe.contentWindow',
            'media.codecs',
            'navigator.hardwareConcurrency',
            'navigator.languages',
            'navigator.permissions',
            'navigator.plugins',
            'navigator.webdriver',
            'sourceurl',
            // 'user-agent-override',
            'webgl.vendor',
            'window.outerdimensions',
        ]),
    }),
);

// const JSON_URL = 'https://customer.xfinity.com/apis/csp/account/me/services/internet/usage?filter=internet';
// const USAGE_URL = 'https://customer.xfinity.com/#/devices#usage';
const LOGIN_URL = 'https://login.xfinity.com/login';
const JSON_URL = 'https://api.sc.xfinity.com/session/csp/selfhelp/account/me/services/internet/usage';
const USAGE_URL = 'https://www.xfinity.com/learn/internet-service/auth';
const MAX_TRIES = 10;

export interface XfinityConfig {
    username: string;
    password: string;
    interval: number;
    pageTimeout: number;
}

const usageSchema = {
    properties: {
        accountNumber: { type: 'string' },
        courtesyUsed: { type: 'float32' },
        courtesyRemaining: { type: 'float32' },
        courtesyAllowed: { type: 'float32' },
        inPaidOverage: { type: 'boolean' },
        displayUsage: { type: 'boolean' },
        usageMonths: {
            elements: {
                properties: {
                    policyName: { type: 'string' },
                    startDate: { type: 'string' },
                    endDate: { type: 'string' },
                    homeUsage: { type: 'float32' },
                    wifiUsage: { type: 'float32' },
                    totalUsage: { type: 'float32' },
                    allowableUsage: { type: 'float32' },
                    unitOfMeasure: { type: 'string' },
                    displayUsage: { type: 'boolean' },
                    devices: {
                        elements: {
                            properties: {
                                id: { type: 'string' },
                                usage: { type: 'float32' },
                                policyName: { type: 'string' },
                            },
                            additionalProperties: true,
                        },
                    },
                    additionalBlocksUsed: { type: 'float32', nullable: true },
                    additionalCostPerBlock: { type: 'float32', nullable: true },
                    additionalUnitsPerBlock: { type: 'float32', nullable: true },
                    additionalBlockSize: { type: 'float32', nullable: true },
                    additionalIncluded: { type: 'float32', nullable: true },
                    additionalUsed: { type: 'float32', nullable: true },
                    additionalPercentUsed: { type: 'float32', nullable: true },
                    additionalRemaining: { type: 'float32', nullable: true },
                    billableOverage: { type: 'float32', nullable: true },
                    overageCharges: { type: 'float32', nullable: true },
                    overageUsed: { type: 'float32', nullable: true },
                    currentCreditAmount: { type: 'float32' },
                    maxCreditAmount: { type: 'float32' },
                    maximumOverageCharge: { type: 'float32', nullable: true },
                    policy: { type: 'string' },
                },
                additionalProperties: true,
            },
        },
    },
    additionalProperties: true,
} as const;

export type XfinityUsage = JTDDataType<typeof usageSchema>;

const ajv = new Ajv();
const validateUsage = ajv.compile<XfinityUsage>(usageSchema);

export class Xfinity {
    #password: string;
    #username: string;
    #pageTimeout: number;
    #usageData: XfinityUsage | null = null;

    constructor({ username, password, pageTimeout }: XfinityConfig) {
        this.#username = username;
        this.#password = password;
        this.#pageTimeout = pageTimeout * 1000;
    }

    async fetch(): Promise<XfinityUsage> {
        this.#usageData = null;

        logger.verbose('Fetching Data');
        const browser = await firefox.launch({
            headless: true,
            firefoxUserPrefs: {
                'privacy.trackingprotection.enabled': true,
            },
        });
        const userAgent = getUserAgent();
        const contextOptions: BrowserContextOptions = {
            userAgent: userAgent.data.userAgent,
            viewport: { width: userAgent.data.viewportWidth, height: userAgent.data.viewportHeight },
        };
        if (process.env.XFINITY_RECORD_VIDEO) {
            contextOptions.recordVideo = { dir: process.env.XFINITY_RECORD_VIDEO_DIR ?? '/config' };
        }
        const context = await browser.newContext(contextOptions);
        // ignore images, fonts and other things that are not needed
        await this.#addIgnore(context);
        // set the timeout for the page
        context.setDefaultTimeout(this.#pageTimeout);
        context.setDefaultNavigationTimeout(this.#pageTimeout);
        const page = await context.newPage();
        this.#stealth(page);
        // listen for xhr response to get usage data
        page.on('response', this.#responseHandler.bind(this));

        await page.route('**/*', (route) => {
            const url = route.request().url();
            if (url.includes('tracker.js') || url.includes('analytics')) {
                route.abort();
            } else {
                route.continue();
            }
        });

        try {
            let currentCount = 0;

            while (this.#usageData === null) {
                if (currentCount >= MAX_TRIES) {
                    throw new Error('Max tries exceeded');
                }

                try {
                    logger.debug('Navigating to starting page');
                    await page.goto(USAGE_URL);

                    // enter username
                    await page.waitForURL(`${LOGIN_URL}*`, { waitUntil: 'domcontentloaded' });
                    await this.#logPageTitle(page);
                    await this.#checkForInvalidLogin(page);
                    await this.#enterUsername(page);

                    // enter password
                    await page.waitForURL(`${LOGIN_URL}**`, { waitUntil: 'domcontentloaded' });
                    await this.#logPageTitle(page);
                    await this.#checkForInvalidLogin(page);
                    await this.#enterPassword(page);

                    // wait for usage page to load
                    await page.waitForURL(USAGE_URL);
                    await this.#logPageTitle(page);
                    await this.#iAmAHuman(page);
                    logger.debug('Waiting for network idle');
                    await page.waitForLoadState('networkidle');
                    logger.debug('Network idle');
                } catch (e) {
                    console.log('i think im here');
                    await this.#logPageTitle(page);
                    if (this.#usageData) {
                        break;
                    }
                    if (isAccessDenied(e)) {
                        logger.debug(`Browser info: ${userAgent.toString()}`);
                        throw e;
                    }
                    logger.silly(e);
                    logger.debug(`Shouldn't be here, starting over`);
                } finally {
                    currentCount++;
                }
            }

            return this.#usageData;
        } finally {
            if (process.env.XFINITY_RECORD_VIDEO) {
                // sleep for a bit to allow the video to finish recording
                await page.waitForTimeout(2000);
            }
            await page.close();
            await context.close();
            await browser.close();
        }
    }

    async #logPageTitle(page: Page) {
        const title = await page.title();
        logger.debug(`Current Page / Title: ${title} / URL: ${page.url()}`);
        if (title === 'Access Denied') {
            throw new Error('Access Denied');
        }
    }

    async #responseHandler(response: Response) {
        if (response.url() === JSON_URL) {
            logger.verbose('Usage data retrieved');
            try {
                const usageData = await response.json();

                if (!validateUsage(usageData)) {
                    logger.verbose('Usage JSON does not match schema');
                    logger.debug(JSON.stringify(validateUsage.errors));
                    logger.silly(JSON.stringify(usageData));
                    return;
                }

                this.#usageData = usageData;
            } catch (e) {
                logger.debug('Error parsing JSON data');
                logger.silly(e);
            }
        }
    }

    async #checkForInvalidLogin(page: Page) {
        if (
            (await this.#isVisible(page, '#passwd-hint')) &&
            (await page.locator('#passwd-hint').textContent()) ===
                'The Xfinity ID or password you entered was incorrect. Please try again.'
        ) {
            throw new Error('Incorrect username or password');
        }
    }

    async #enterUsername(page: Page) {
        logger.debug('Filling in username');
        await this.#enterInfo(page, '#user', this.#username);
    }

    async #enterPassword(page: Page) {
        logger.debug('Filling in password');
        await this.#enterInfo(page, '#passwd', this.#password);
    }

    async #enterInfo(page: Page, selector: string, value: string) {
        const field = page.locator(selector);
        await field.click();
        await field.fill(value);
        await this.#sleep(page, 1000);
        await page.locator('#sign_in').click();
    }

    async #addIgnore(context: BrowserContext) {
        await context.route('**/*', (route) => {
            const resourceType = route.request().resourceType();
            switch (resourceType) {
                case 'image':
                case 'font': {
                    route.abort();
                    return;
                }
                default: {
                    const domain = /(.*\.)?xfinity\.com.*/;
                    const url = route.request().url();
                    if (!domain.test(url)) {
                        route.abort();
                        return;
                    }
                }
            }

            route.continue();
        });
    }

    async #isVisible(page: Page, selector: string): Promise<boolean> {
        try {
            return page.locator(selector).isVisible();
        } catch {
            return false;
        }
    }

    async #iAmAHuman(page: Page) {
        const randomX = Math.floor(Math.random() * 800) + 100;
        const randomY = Math.floor(Math.random() * 600) + 100;
        await page.mouse.move(randomX, randomY, { steps: 10 });

        if (Math.random() < 0.5) {
            await page.mouse.click(randomX, randomY);
        }

        if (Math.random() < 0.5) {
            await page.mouse.wheel(Math.floor(Math.random() * 190) + 10, 0);
        }
    }

    #stealth(page: Page) {
        page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Upgrade-Insecure-Requests': '1',
        });
    }

    #sleep(page: Page, ms: number) {
        const randomOffset = Math.floor(Math.random() * 1000);
        ms += randomOffset;
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
