import { BrowserContext, firefox, Page, Response } from 'playwright';

import logger from './logger.js';

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

interface XfinityUsageMonth {
    policyName: string;
    startDate: string;
    endDate: string;
    homeUsage: number;
    wifiUsage: number;
    totalUsage: number;
    allowableUsage: number;
    unitOfMeasure: string;
    displayUsage: boolean;
    devices: Array<{ id: string; usage: number }>;
    additionalBlocksUsed: number;
    additionalCostPerBlock: number;
    additionalUnitsPerBlock: number;
    additionalIncluded: number;
    additionalUsed: number;
    additionalPercentUsed: number;
    additionalRemaining: number;
    billableOverage: number;
    overageCharges: number;
    overageUsed: number;
    currentCreditAmount: number;
    maxCreditAmount: number;
    policy: string;
}

export interface XfinityUsage {
    courtesyUsed: number;
    courtesyRemaining: number;
    courtesyAllowed: number;
    inPaidOverage: boolean;
    displayUsage: boolean;
    usageMonths: Array<XfinityUsageMonth>;
}

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
        const context = await browser.newContext();
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

                    // enter username
                    await page.goto(USAGE_URL);
                    await page.waitForURL(USAGE_URL);
                    this.#logPageTitle(page);
                    await this.#checkForInvalidLogin(page);
                    await this.#enterUsername(page);

                    // enter password
                    await page.waitForURL(LOGIN_URL);
                    this.#logPageTitle(page);
                    await this.#checkForInvalidLogin(page);
                    await this.#enterPassword(page);

                    // wait for usage page to load
                    await page.waitForURL(USAGE_URL);
                    logger.debug('Waiting for usage page to load and display usage');
                    await page.waitForSelector('#usage');
                    logger.debug('Usage table loaded and now waiting for network idle');
                    await page.waitForLoadState('networkidle');
                    logger.debug('Network idle');
                } catch (e) {
                    logger.debug(e);
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

    #logPageTitle = async (page: Page) => {
        logger.debug(`Current Title: ${await page.title()} URL: ${page.url()}`);
    };

    async #responseHandler(response: Response) {
        if (response.url() === JSON_URL) {
            logger.verbose('Usage data retrieved');
            this.#usageData = (await response.json()) as XfinityUsage;
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
