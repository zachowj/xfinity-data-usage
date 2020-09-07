import { EventEmitter } from 'events';
import puppeteer from 'puppeteer-core';
import randomUseragent from 'random-useragent';

export const DATA_UPDATED = 'dataUpdated';
const JSON_URL = 'https://customer.xfinity.com/apis/services/internet/usage';
const LOGIN_URL = 'https://customer.xfinity.com';
const SECURITY_CHECK_TITLE = 'Security Check';

export interface xfinityConfig {
    username: string;
    password: string;
    interval: number;
    pageTimeout: number;
}

export interface xfinityUsage {
    courtesyUsed: number;
    courtesyRemaining: number;
    courtesyAllowed: number;
    inPaidOverage: boolean;
    displayUsage: boolean;
    usageMonths: Array<xfinityUsageMonth>;
    error?: string;
    logged_in_within_limit?: boolean;
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

export class Xfinity extends EventEmitter {
    #browser?: puppeteer.Browser;
    #page?: puppeteer.Page;
    #data: xfinityUsage | undefined;
    #password: string;
    #username: string;
    #interval: number;
    #intervalMs: number;
    #pageTimeout: number;

    constructor({ username, password, interval, pageTimeout }: xfinityConfig) {
        super();

        this.#username = username;
        this.#password = password;
        this.#interval = interval;
        this.#intervalMs = interval * 60000;
        this.#pageTimeout = pageTimeout * 1000;
    }

    start(): void {
        this.fetch();
        setInterval(this.fetch.bind(this), this.#intervalMs);
    }

    getData(): xfinityUsage | undefined {
        return this.#data;
    }

    private async fetch() {
        const nextAt = new Date(Date.now() + this.#intervalMs).toLocaleTimeString();

        console.log('Fetching Data');
        try {
            this.#data = await this.retrieveDataUsage();
            console.log('Data updated');
            this.emit(DATA_UPDATED, this.#data);
        } catch (e) {
            console.error(`Browser Error: ${e}`);
        } finally {
            await this.#browser?.close();
            this.#page = undefined;
        }

        console.log(`Next fetch in ${this.#interval} minutes @ ${nextAt}`);
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

        await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
        await page.waitForSelector('#user');
        await page.type('#user', this.#username);
        await page.type('#passwd', this.#password);
        await page.click('#sign_in');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        const pageTitle = await page.title();
        console.log('Page Title: ', pageTitle);
        if (pageTitle === SECURITY_CHECK_TITLE) {
            await this.bypassSecurityCheck();
        }
    }

    private async bypassSecurityCheck() {
        console.log('Clicking "Ask me later" for security check');
        const page = await this.getPage();
        await page.click('.cancel');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
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

            await page.setUserAgent(this.getUseragent());
            page.setDefaultNavigationTimeout(this.#pageTimeout);
            await page.setViewport({ width: 1920, height: 1080 });

            this.#page = page;
        }

        return this.#page;
    }

    private getUseragent(): string {
        const USERAGENT =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36';

        const useragent = randomUseragent.getRandom(function (ua) {
            return ua.browserName === 'Chrome' && parseFloat(ua.browserVersion) >= 50;
        });

        return useragent ?? USERAGENT;
    }
}
