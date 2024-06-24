import { BrowserContext, Cookie, firefox, Page, Response } from 'playwright';

import { readCookies, writeCookies } from './cookies.js';
import logger from './logger.js';

const JSON_URL = 'https://customer.xfinity.com/apis/csp/account/me/services/internet/usage?filter=internet';
const LOGIN_URL = 'https://login.xfinity.com/login';
const USAGE_URL = 'https://customer.xfinity.com/#/devices#usage';
const MAX_TRIES = 3;

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
        context.addCookies(readCookies());
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

            // load the usage page
            logger.debug(`Loading ${USAGE_URL}`);
            await page.goto(USAGE_URL);

            while (this.#usageData === null) {
                if (currentCount >= MAX_TRIES) {
                    // reset cookies
                    await this.#saveCookies([]);
                    throw new Error('Max tries exceeded');
                }

                // wait for the page to finish loading
                try {
                    await page.waitForLoadState('networkidle');
                } catch (e) {
                    logger.debug('Timed out waiting for network idle');
                    currentCount++;
                    await this.#startOver(page);
                    continue;
                }

                const currentPage = page.url();
                const currentPageTitle = await page.title();
                logger.debug(`Current Title: ${currentPageTitle} URL: ${currentPage}`);

                // the appropriate action based on the current page
                if (currentPage.startsWith(LOGIN_URL)) {
                    await this.#checkForInvalidLogin(page);
                    if (await this.#isVisible(page, '#user')) {
                        await this.#enterUsername(page);
                    } else if (await this.#isVisible(page, '#passwd')) {
                        await this.#enterPassword(page);
                    } else {
                        currentCount++;
                        await this.#startOver(page);
                    }
                } else if (currentPage === USAGE_URL) {
                    logger.debug('Waiting for usage page to load and display usage');
                    try {
                        await page.waitForSelector('#usage');
                        logger.debug('Usage table loaded');
                    } catch (e) {
                        logger.debug('Timed out waiting for usage table to load');
                        currentCount++;
                        await this.#startOver(page);
                    }
                } else {
                    currentCount++;
                    await this.#startOver(page);
                }
            }

            this.#saveCookies(await context.cookies());
            return this.#usageData;
        } finally {
            await page.close();
            await context.close();
            await browser.close();
        }
    }

    async #startOver(page: Page) {
        logger.debug(`Shouldn't be here, starting over`);
        logger.debug(`Loading ${USAGE_URL}`);
        await page.goto(USAGE_URL);
    }

    async #responseHandler(response: Response) {
        if (response.url() === JSON_URL) {
            logger.verbose('Data retrieved');
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

    async #saveCookies(cookies: Cookie[]) {
        logger.debug('Saving cookies for next fetch');
        await writeCookies(cookies);
    }

    async #screenshot(page: Page, filename: string, fullPage = false) {
        // console.log(filename, page.url());
        return await page.screenshot({ path: `_${filename}-${Date.now()}.png`, fullPage });
        // return page.screenshot({ path: `/config/screenshots/_${filename}-${Date.now()}.png`, fullPage });
    }
}
