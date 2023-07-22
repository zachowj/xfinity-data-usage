import { BrowserContext, devices, Page, Response } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

import logger from './logger.js';

chromium.use(stealth());

const CHROMUIM_BIN = process.env.CHROMIUM_BIN ?? '/usr/bin/chromium';
const JSON_URL = 'https://customer.xfinity.com/apis/csp/account/me/services/internet/usage?filter=internet';
const LOGIN_URL = 'https://login.xfinity.com/login';
const USAGE_URL = 'https://customer.xfinity.com/#/devices#usage';
const MAX_TRIES = 3;

// state of a user enter a website
enum State {
    NotLoggedIn = 'NotLoggedIn',
    UsernameEntered = 'UsernameEntered',
    LoggedIn = 'LoggedIn',
}

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
    #state: State = State.NotLoggedIn;

    constructor({ username, password, pageTimeout }: XfinityConfig) {
        this.#username = username;
        this.#password = password;
        this.#pageTimeout = pageTimeout * 1000;
    }

    async fetch(): Promise<XfinityUsage> {
        this.#state = State.NotLoggedIn;
        this.#usageData = null;

        logger.verbose('Fetching Data');
        const browser = await chromium.launch({
            executablePath: CHROMUIM_BIN,
            headless: true,
        });
        const context = await browser.newContext(devices['Desktop Chrome']);
        // ignore images, fonts and other things that are not needed
        await this.#addIgnore(context);
        // set the timeout for the page
        context.setDefaultTimeout(this.#pageTimeout);
        context.setDefaultNavigationTimeout(this.#pageTimeout);
        const page = await context.newPage();
        // listen for xhr response to get usage data
        page.on('response', this.#responseHandler.bind(this));
        // load the usage page
        logger.debug(`Loading ${USAGE_URL}`);

        try {
            let currentCount = 0;
            let previousState: State | null = null;

            if (currentCount === 0) {
                await page.goto(USAGE_URL);
            }

            while (this.#usageData === null) {
                // wait for the page to finish loading
                await page.waitForLoadState('networkidle');

                const currentPage = page.url();
                logger.debug(`Current URL: ${currentPage}`);
                if (previousState !== this.#state) {
                    previousState = this.#state;
                    currentCount = 0;
                } else {
                    currentCount++;
                }
                // if the state didn't change for 3 times, throw an error
                if (currentCount > MAX_TRIES - 1) {
                    throw new Error(`State did not change for ${currentCount} tries. Last state: ${this.#state}`);
                }

                // check the state and do the appropriate action
                if (currentPage.startsWith(LOGIN_URL)) {
                    if (await this.#isVisible(page, '#user')) {
                        this.#setState(State.NotLoggedIn);
                        await this.#enterUsername(page);
                    } else if (await this.#isVisible(page, '#passwd')) {
                        this.#setState(State.UsernameEntered);
                        await this.#enterPassword(page);
                    } else {
                        await this.#startOver(page);
                    }
                } else if (currentPage === USAGE_URL) {
                    if (this.#isState(State.LoggedIn) && this.#usageData === null) {
                        logger.debug(`Didn't get usage data, reloading page`);
                        await page.reload();
                    }
                    this.#setState(State.LoggedIn);
                } else {
                    await this.#startOver(page);
                }
            }

            return this.#usageData;
        } finally {
            await page.close();
            await context.close();
            await browser.close();
        }
    }

    async #startOver(page: Page) {
        logger.debug(`Shouldn't be here, starting over`);
        this.#setState(State.NotLoggedIn);
        await page.goto(USAGE_URL);
    }

    async #responseHandler(response: Response) {
        if (response.url() === JSON_URL) {
            logger.verbose('Data retrieved');
            this.#usageData = (await response.json()) as XfinityUsage;
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

    #setState(state: State) {
        logger.silly(`State was set to ${state} from ${this.#state}`);
        this.#state = state;
    }

    #isState(state: State) {
        return this.#state === state;
    }

    async #isVisible(page: Page, selector: string): Promise<boolean> {
        await page.waitForLoadState('networkidle');
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
