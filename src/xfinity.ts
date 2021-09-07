import { EventEmitter } from 'events';
import puppeteer from 'puppeteer-core';
import UserAgent from 'user-agents';

import Cookies from './cookies.js';
import { fetchCode, imapConfig } from './imap.js';
import Password from './password.js';

const JSON_URL = 'https://customer.xfinity.com/apis/csp/account/me/services/internet/usage?filter=internet';
const LOGIN_URL = 'https://customer.xfinity.com';
const LOGIN_TITLE = 'XFINITY | My Account | EcoBill® Online Bill Pay';
const SECURITY_CHECK_TITLE = 'Security Check';
const PASSWORD_RESET_TITLE = 'Please reset your Xfinity password';

export interface xfinityConfig {
    username: string;
    password: string;
    interval: number;
    pageTimeout: number;
}

interface xfinityUsageMonth {
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

export interface xfinityUsage {
    courtesyUsed: number;
    courtesyRemaining: number;
    courtesyAllowed: number;
    inPaidOverage: boolean;
    displayUsage: boolean;
    usageMonths: Array<xfinityUsageMonth>;
    error?: string;
    /* eslint-disable-next-line camelcase */
    logged_in_within_limit?: boolean;
}

export class Xfinity extends EventEmitter {
    #browser?: puppeteer.Browser;
    #page?: puppeteer.Page;
    #password: string;
    #username: string;
    #pageTimeout: number;
    #userAgent: string | undefined;
    #imapConfig: imapConfig | undefined;
    #Password?: Password;
    #Cookies: Cookies;

    constructor({ username, password, pageTimeout }: xfinityConfig, imapConfig: imapConfig | undefined) {
        super();

        this.#username = username;
        this.#password = password;
        this.#pageTimeout = pageTimeout * 1000;
        this.#imapConfig = imapConfig;
        if (imapConfig) {
            this.#Password = new Password(this.#password);
        }
        this.#Cookies = new Cookies();
    }

    getPassword(): string {
        if (this.#imapConfig && this.#Password) {
            return this.#Password.getPassword();
        }

        return this.#password;
    }

    async fetch(): Promise<xfinityUsage | void> {
        let data: xfinityUsage | undefined;
        if (!this.#userAgent) {
            this.#userAgent = this.getUserAgent();
        }

        console.log('Fetching Data');
        try {
            data = await this.retrieveDataUsage();
            console.log('Data retrieved');
        } catch (e) {
            this.#userAgent = undefined;
            throw e;
        } finally {
            await this.#browser?.close();
            this.#page = undefined;
        }

        return data;
    }

    private async retrieveDataUsage(): Promise<xfinityUsage> {
        let data: xfinityUsage;
        let retries = 3;

        do {
            if (retries === 0) {
                throw new Error('Unable to login');
            }
            if (retries !== 3) {
                console.info('Not logged in');
            }
            await this.authenticate();
            retries--;
            data = await this.getJson();
        } while (data.error === 'unauthenticated' || data.logged_in_within_limit === false);

        return data;
    }

    private async getJson(): Promise<xfinityUsage> {
        console.info(`Loading Usage ${JSON_URL}`);
        const page = await this.getPage();

        await page.goto(JSON_URL, { waitUntil: 'networkidle0' });
        const text = await page.$eval('pre', (e) => e.innerHTML);

        let jsonData;
        try {
            jsonData = JSON.parse(text.toString());
        } catch (e) {
            console.log('Bad JSON', text);
        }

        return jsonData;
    }

    private async authenticate() {
        console.info(`Loading (${LOGIN_URL})`);
        const page = await this.getPage();

        try {
            await page.goto(LOGIN_URL, { waitUntil: 'networkidle0' });
            await page.waitForSelector('title');

            let pageTitle = await page.title();
            console.log('Page Title: ', pageTitle);
            if (pageTitle === LOGIN_TITLE) {
                // We're already logged in
                return;
            }

            await this.login();
            pageTitle = await page.title();
            console.log('Page Title: ', pageTitle);

            if (pageTitle === PASSWORD_RESET_TITLE) {
                await this.resetPassword();
            } else if (pageTitle === SECURITY_CHECK_TITLE) {
                await this.bypassSecurityCheck();
            }
        } finally {
            console.log('Saving cookies for next fetch');
            const cookies = await page.cookies();
            await this.#Cookies.writeCookies(cookies);
        }
    }

    private async login() {
        console.log('Logging in');
        const page = await this.getPage();
        await page.waitForSelector('#user');
        await page.type('#user', this.#username);
        await page.type('#passwd', this.getPassword());
        return Promise.all([
            page.click('#sign_in'),
            page.waitForNavigation({ waitUntil: ['networkidle2', 'load', 'domcontentloaded'] }),
        ]);
    }

    private async resetPassword() {
        console.log('Attempting to reset password');
        if (this.#imapConfig === undefined) {
            throw new Error('No imap configured');
        }
        if (!this.#Password) {
            return;
        }
        const page = await this.getPage();
        await Promise.all([page.click('.submit'), page.waitForNavigation({ waitUntil: 'networkidle2' })]);
        await Promise.all([page.click('#submitButton'), page.waitForNavigation({ waitUntil: 'networkidle2' })]);

        // Wait for the page to load
        await page.waitForSelector('#resetCodeEntered');

        // Get Code
        const code = await fetchCode(this.#imapConfig).catch((e) => console.error(e));
        if (!code) return;
        console.log(`CODE: ${code}`);

        // Enter Code
        await page.type('#resetCodeEntered', code);
        await Promise.all([page.click('#submitButton'), page.waitForNavigation({ waitUntil: 'networkidle2' })]);
        await page.waitForSelector('#password');
        const password = this.#Password.generatePassword();
        await page.type('#password', password);
        await page.type('#passwordRetype', password);
        await Promise.all([page.click('#submitButton'), page.waitForNavigation({ waitUntil: 'networkidle2' })]);
        await this.#Password.savePassword();
    }

    private async bypassSecurityCheck() {
        console.log('Clicking "Ask me later" for security check');
        const page = await this.getPage();
        await Promise.all([page.click('.cancel'), page.waitForNavigation({ waitUntil: 'networkidle2' })]);
    }

    private async getBrowser() {
        if (this.#browser?.isConnected()) return this.#browser;

        this.#browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        });

        return this.#browser;
    }

    private async getPage() {
        if (this.#page?.isClosed() !== false) {
            const browser = await this.getBrowser();
            const page = await browser.newPage();

            await page.setCookie(...this.#Cookies.readCookies());
            if (this.#userAgent) {
                await page.setUserAgent(this.getUserAgent());
            }
            page.setDefaultNavigationTimeout(this.#pageTimeout);
            await page.setViewport({ width: 1920, height: 1080 });

            this.#page = page;
            await page.setRequestInterception(true);
            page.on('request', this.onRequest);
        }

        return this.#page;
    }

    private getUserAgent(): string {
        return new UserAgent().toString();
    }

    private onRequest(request: puppeteer.HTTPRequest) {
        const resourceType = request.resourceType();
        switch (resourceType) {
            case 'image':
            case 'font': {
                request.abort();
                break;
            }
            default: {
                const domain = /(.*\.)?xfinity\.com.*/;
                const url = request.url();
                if (domain.test(url)) {
                    request.continue();
                } else {
                    request.abort();
                }
            }
        }
    }

    private async screenshot(filename: string) {
        const page = await this.getPage();
        return await page.screenshot({ path: `${filename}.png` });
        // return page.screenshot({ path: `/config/screenshots/${filename}.png` });
    }
}
