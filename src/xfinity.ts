import axios from 'axios';
import * as puppeteer from 'puppeteer-core';

// import { readCookies, writeCookies } from './cookies.js';
import { fetchCode, imapConfig } from './imap.js';
import logger from './logger.js';
import Password from './password.js';
import { generateUserAgent, userAgent } from './userAgent.js';
import { isXfinityUsageError } from './utils.js';

const JSON_URL = 'https://api.sc.xfinity.com/session/csp/selfhelp/account/me/services/internet/usage';
const LOGIN_URL = 'https://customer.xfinity.com';
const SECURITY_CHECK_TITLE = 'Security Check';
const PASSWORD_RESET_TITLE = 'Please reset your Xfinity password';
const ACCESS_DENIED_TITLE = 'Access Denied';
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
    #browser?: puppeteer.Browser;
    #page?: puppeteer.Page;
    #password: string;
    #username: string;
    #pageTimeout: number;
    #userAgent: userAgent;
    #imapConfig?: imapConfig;
    #Password?: Password;
    #authToken: string | null = null;

    constructor({ username, password, pageTimeout }: XfinityConfig, imapConfig?: imapConfig) {
        this.#username = username;
        this.#password = password;
        this.#pageTimeout = pageTimeout * 1000;
        this.#imapConfig = imapConfig;
        if (imapConfig) {
            this.#Password = new Password(this.#password);
        }
        this.#userAgent = generateUserAgent();
    }

    #getPassword(): string {
        if (this.#imapConfig && this.#Password) {
            return this.#Password.getPassword();
        }

        return this.#password;
    }

    async fetch(): Promise<XfinityUsage> {
        logger.verbose('Fetching Data');
        this.#authToken = null;
        try {
            const data = await this.#retrieveDataUsage();
            logger.verbose('Data retrieved');
            return data;
        } finally {
            await this.#page?.close();
            await this.#browser?.close();
        }
    }

    async #retrieveDataUsage(): Promise<XfinityUsage> {
        let data: XfinityUsage | XfinityUsageError | undefined;
        let retries = 3;

        do {
            if (retries === 0) {
                throw new Error('Unable to login');
            }
            if (retries !== 3) {
                logger.debug('Not logged in');
            }
            await this.#authenticate();
            await this.#getToken();
            retries--;
            if (!this.#authToken) continue;
            data = await this.#getJson();
        } while (!data || (isXfinityUsageError(data) && data.code.startsWith('SSM.')));

        if (isXfinityUsageError(data)) {
            throw new Error(data.message);
        }

        // await this.#saveCookies();

        return data;
    }

    async #getToken(): Promise<void> {
        logger.debug('Getting Token');
        const page = await this.#getPage();
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

    async #authenticate() {
        logger.debug(`Loading (${LOGIN_URL})`);
        const page = await this.#getPage();

        await this.#login();

        const pageTitle = await page.title();
        logger.debug(`Page Title: ${pageTitle}`);

        if (pageTitle === PASSWORD_RESET_TITLE) {
            await this.#resetPassword();
        } else if (pageTitle === SECURITY_CHECK_TITLE) {
            await this.#bypassSecurityCheck();
        }
    }

    async #login() {
        logger.debug('Logging in');
        const page = await this.#getPage();
        await page.goto(LOGIN_URL, { waitUntil: ['networkidle0', 'load', 'domcontentloaded'] });

        const title = await page.title();
        if (title === ACCESS_DENIED_TITLE) {
            logger.debug(await page.content());
            throw new Error('Access Denied. You may be blocked');
        } else if (title === SIGN_IN_TITLE) {
            await this.#waitForSelectorVisible('#user', '#sign_in');
            await page.type('#user', this.#username);
            await Promise.all([page.click('#sign_in'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);
            await this.#waitForSelectorVisible('#passwd');
            await page.type('#passwd', this.#getPassword());

            return Promise.all([
                page.click('#sign_in'),
                page.waitForNavigation({ waitUntil: ['networkidle0', 'load', 'domcontentloaded'] }),
            ]);
        }

        logger.debug('Already signed in');
    }

    async #resetPassword() {
        logger.info('Attempting to reset password');
        if (this.#imapConfig === undefined) {
            throw new Error('No imap configured');
        }
        if (!this.#Password) {
            return;
        }
        const page = await this.#getPage();
        await this.#waitForSelectorVisible('.submit');
        await Promise.all([page.click('.submit'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

        await this.#waitForSelectorVisible('#submitButton');
        await Promise.all([page.click('#submitButton'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

        // Wait for the page to load
        await this.#waitForSelectorVisible('#resetCodeEntered');

        // Get Code
        const code = await fetchCode(this.#imapConfig).catch((e) => {
            logger.error(e);
        });
        if (!code) return;
        logger.debug(`CODE: ${code}`);

        // Enter Code
        await this.#waitForSelectorVisible('#resetCodeEntered', '#submitButton');
        await page.type('#resetCodeEntered', code);
        await Promise.all([page.click('#submitButton'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

        await this.#waitForSelectorVisible('#password', '#passwordRetype', '#submitButton');
        const password = this.#Password.generatePassword();
        await page.type('#password', password);
        await page.type('#passwordRetype', password);
        await Promise.all([page.click('#submitButton'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

        // Check to see if password was accepted
        await this.#waitForSelectorVisible('h2');
        const element = await page.$('h2 span');
        const elementClasses = await element?.getProperty('className');
        const classString = await elementClasses?.jsonValue();

        if (!classString?.includes('verified-large')) {
            throw new Error(
                'Unable to verify the password reset. The confirmation page was not found. The password suffix value will not be incremented.',
            );
        }

        await this.#Password.savePassword();
        logger.info('Password reset');
    }

    async #bypassSecurityCheck() {
        logger.info('Clicking "Ask me later" for security check');
        const page = await this.#getPage();
        this.#waitForSelectorVisible('.cancel');
        await Promise.all([page.click('.cancel'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);
    }

    async #getBrowser() {
        if (this.#browser?.isConnected()) return this.#browser;

        this.#browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            pipe: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });

        return this.#browser;
    }

    async #getPage() {
        if (this.#page?.isClosed() !== false) {
            const browser = await this.#getBrowser();
            const page = await browser.newPage();

            // await page.setCookie(...readCookies());
            const { userAgent, width, height } = this.#userAgent;
            await page.setUserAgent(userAgent);
            await page.setViewport({ width, height });
            page.setDefaultNavigationTimeout(this.#pageTimeout);

            this.#page = page;
            await page.setRequestInterception(true);
            page.on('request', this.#onRequest.bind(this));
        }

        return this.#page;
    }

    #onRequest(request: puppeteer.HTTPRequest) {
        const resourceType = request.resourceType();
        switch (resourceType) {
            case 'image':
            case 'font': {
                request.abort();
                return;
            }
            default: {
                const domain = /(.*\.)?xfinity\.com.*/;
                const url = request.url();
                if (!domain.test(url)) {
                    request.abort();
                    return;
                }
            }
        }
        if (request.url() === JSON_URL) {
            const headers = request.headers();
            headers.Authorization = `Bearer ${this.#authToken}`;
            request.continue({ headers });
            return;
        }

        request.continue();
    }

    async #waitForSelectorVisible(...selectors: string[]) {
        const page = await this.#getPage();
        const items = selectors.map((selector) => page.waitForSelector(selector, { timeout: 30000, visible: true }));

        return Promise.all(items);
    }

    // async #saveCookies() {
    //     logger.debug('Saving cookies for next fetch');
    //     const page = await this.#getPage();
    //     const cookies = await page.cookies();
    //     await writeCookies(cookies);
    // }

    async #screenshot(filename: string) {
        const page = await this.#getPage();
        console.log(filename, page.url());
        return await page.screenshot({ path: `${filename}-${Date.now()}.png` });
        // return page.screenshot({ path: `/config/screenshots/${filename}.png` });
    }
}
