import { EventEmitter } from 'events';
import puppeteer from 'puppeteer-core';
import randomUseragent from 'random-useragent';

export const DATA_UPDATED = 'dataUpdated';
const JSON_URL = 'https://customer.xfinity.com/apis/services/internet/usage';
const LOGIN_URL = 'https://customer.xfinity.com';
const SECURITY_CHECK_TITLE = 'Security Check';

export interface xfinityConfig {
    user: string;
    password: string;
    interval: number;
}

export class Xfinity extends EventEmitter {
    #intervalId: NodeJS.Timeout | undefined;
    isRunning = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #data: any;
    #password: string;
    #user: string;
    #interval: number;
    #intervalMs: number;
    browser?: puppeteer.Browser;
    page?: puppeteer.Page;

    constructor({ user, password, interval }: xfinityConfig) {
        super();

        this.#data = {};
        this.#user = user;
        this.#password = password;
        this.#interval = interval;
        this.#intervalMs = interval * 60000;
    }

    start(): void {
        this.fetch();
        this.#intervalId = setInterval(this.fetch.bind(this), this.#intervalMs);
    }

    getData(): unknown {
        return this.#data;
    }

    private async fetch() {
        const nextAt = new Date(Date.now() + this.#intervalMs).toLocaleTimeString();

        console.log('Fetching Data');
        try {
            this.#data = await this.retrieveDataUsage();
            this.emit(DATA_UPDATED, this.#data);
        } catch (e) {
            console.error(`Driver Error: ${e}`);
        } finally {
            if (this.browser) await this.browser.close();
        }

        console.log(`Next fetch in ${this.#interval} minutes @ ${nextAt}`);
    }

    private async retrieveDataUsage() {
        this.isRunning = true;
        let data;
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

        console.log('Data updated');
        this.isRunning = false;
        return data;
    }

    private async getJson() {
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
        await page.type('#user', this.#user);
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
    }

    private async getBrowser() {
        if (this.browser) return this.browser;

        this.browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-dev-shm-usage'],
        });

        return this.browser;
    }

    private async getPage() {
        if (this.page) return this.page;

        const browser = await this.getBrowser();
        this.page = await browser.newPage();
        await this.page.setUserAgent(this.getUseragent());

        return this.page;
    }

    private getUseragent(): string {
        const USERAGENT =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36';

        const useragent = randomUseragent.getRandom(function (ua) {
            return ['Chrome', 'Firefix'].includes(ua.browserName) && parseFloat(ua.browserVersion) >= 40;
        });

        return useragent ?? USERAGENT;
    }
}
