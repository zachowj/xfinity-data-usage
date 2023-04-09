import axios from 'axios';
import { BrowserContext, chromium, devices, Page } from 'playwright';

import logger from './logger.js';
import { isXfinityUsageError } from './utils.js';

const CHROMUIM_BIN = '/usr/bin/chromium';
const JSON_URL = 'https://api.sc.xfinity.com/session/csp/selfhelp/account/me/services/internet/usage';
const LOGIN_URL = 'https://customer.xfinity.com';
const SIGN_IN_TITLE = 'Sign in to Xfinity';

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

export interface XfinityUsageError {
    code: string;
    message: string;
}

export class Xfinity {
    #password: string;
    #username: string;
    #authToken: string | null = null;

    constructor({ username, password }: XfinityConfig) {
        this.#username = username;
        this.#password = password;
    }

    async fetch(): Promise<XfinityUsage> {
        logger.verbose('Fetching Data');
        this.#authToken = null;
        const browser = await chromium.launch({
            executablePath: CHROMUIM_BIN,
            headless: true,
        });
        const context = await browser.newContext(devices['Desktop Chrome']);
        await this.#addIgnore(context);

        try {
            const page = await context.newPage();

            const data = await this.#retrieveDataUsage(context, page);
            logger.verbose('Data retrieved');
            return data;
        } finally {
            await context.close();
            await browser.close();
        }
    }

    async #retrieveDataUsage(context: BrowserContext, page: Page): Promise<XfinityUsage> {
        let data: XfinityUsage | XfinityUsageError | undefined;
        let retries = 3;

        do {
            if (retries === 0) {
                throw new Error('Unable to login');
            }
            if (retries !== 3) {
                logger.debug('Not logged in');
            }
            await this.#authenticate(page);
            await page.waitForLoadState('networkidle');
            await this.#getToken(page);
            retries--;
            if (!this.#authToken) continue;
            data = await this.#getJson();
        } while (!data || isXfinityUsageError(data));

        if (isXfinityUsageError(data)) {
            throw new Error(data.message);
        }

        return data;
    }

    async #getToken(page: Page): Promise<void> {
        logger.debug('Getting Token');
        const token = await page.evaluate(() =>
            window.localStorage.getItem('xfinity-learn-ui_https://api.sc.xfinity.com/session'),
        );
        this.#authToken = token;
    }

    async #getJson(): Promise<XfinityUsage | XfinityUsageError> {
        logger.debug(`Fetching Usage ${JSON_URL}`);
        const response = await axios.get<XfinityUsage | XfinityUsageError>(JSON_URL, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.#authToken}`,
            },
        });

        return response.data;
    }

    async #authenticate(page: Page) {
        logger.debug(`Loading (${LOGIN_URL})`);

        await this.#login(page);

        const pageTitle = await page.title();
        logger.debug(`Page Title: ${pageTitle}`);
    }

    async #login(page: Page) {
        logger.debug('Logging in');
        await page.goto(LOGIN_URL);
        const title = await page.title();
        if (title === SIGN_IN_TITLE) {
            await page.locator('#user').fill(this.#username);
            await page.locator('#sign_in').click();
            await page.waitForLoadState('networkidle');
            await page.locator('#passwd').fill(this.#password);
            await page.locator('#sign_in').click();
            return;
        }
        logger.debug('Already signed in');
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

    async #screenshot(page: Page, filename: string) {
        console.log(filename, page.url());
        return await page.screenshot({ path: `${filename}-${Date.now()}.png` });
        // return page.screenshot({ path: `/config/screenshots/${filename}.png` });
    }
}
