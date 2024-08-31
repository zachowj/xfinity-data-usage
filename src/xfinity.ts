import Ajv, { JTDDataType } from 'ajv/dist/jtd.js';
import { BrowserContext, BrowserContextOptions, firefox, Page, Response } from 'playwright';

import logger from './logger.js';
import { getUserAgent, isAccessDenied } from './utils.js';

const JSON_URL = 'https://customer.xfinity.com/apis/csp/account/me/services/internet/usage?filter=internet';
const LOGIN_URL = 'https://login.xfinity.com/login';
const USAGE_URL = 'https://customer.xfinity.com/#/devices#usage';
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
        // listen for xhr response to get usage data
        page.on('response', this.#responseHandler.bind(this));

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
                    await page.waitForURL(USAGE_URL);
                    await this.#logPageTitle(page);
                    await this.#checkForInvalidLogin(page);
                    await this.#enterUsername(page);

                    // enter password
                    await page.waitForURL(LOGIN_URL);
                    await this.#logPageTitle(page);
                    await this.#checkForInvalidLogin(page);
                    await this.#enterPassword(page);

                    // wait for usage page to load
                    await page.waitForURL(USAGE_URL);
                    await this.#logPageTitle(page);
                    logger.debug('Waiting for network idle');
                    await page.waitForLoadState('networkidle');
                    logger.debug('Network idle');
                } catch (e) {
                    if (isAccessDenied(e)) {
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
        await page.locator('#user').fill(this.#username);
        await page.locator('#sign_in').click();
    }

    async #enterPassword(page: Page) {
        logger.debug('Filling in password');
        await page.locator('#passwd').fill(this.#password);
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

    async #screenshot(page: Page, filename: string, fullPage = false) {
        // console.log(filename, page.url());
        return await page.screenshot({ path: `_${filename}-${Date.now()}.png`, fullPage });
        // return page.screenshot({ path: `/config/screenshots/_${filename}-${Date.now()}.png`, fullPage });
    }
}
