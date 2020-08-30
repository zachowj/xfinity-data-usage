import { EventEmitter } from 'events';
import firefox from 'selenium-webdriver/firefox';
import { promises as fs } from 'fs';
import webdriver, { By, until } from 'selenium-webdriver';

const COOKIES_FILE = 'cookies.json';
export const DATA_UPDATED = 'dataUpdated';
const JSON_URL = 'https://customer.xfinity.com/apis/services/internet/usage';
const LOGIN_URL = 'https://customer.xfinity.com';

interface xfinityConfig {
    user: string;
    password: string;
    interval: number;
}

export class Xfinity extends EventEmitter {
    #driver: webdriver.ThenableWebDriver | undefined;
    #driverOptions: firefox.Options;
    #intervalId: NodeJS.Timeout | undefined;
    isRunning: boolean = false;
    #data: any;
    #password: string;
    #user: string;
    #interval: number;
    #intervalMs: number;

    constructor({ user, password, interval }: xfinityConfig) {
        super();

        this.#driverOptions = new firefox.Options()
            .setPreference('devtools.jsonview.enabled', false)
            .setPreference('dom.webdriver.enabled', false);
        this.#driverOptions.addArguments('-headless');

        this.#data = {};
        this.#user = user;
        this.#password = password;
        this.#interval = interval;
        this.#intervalMs = interval * 60000;
    }

    start() {
        this.fetch();
        this.#intervalId = setInterval(this.fetch.bind(this), this.#intervalMs);
    }

    getData() {
        return this.#data;
    }

    private async fetch() {
        console.log('Fetching Data');
        try {
            this.#driver = new webdriver.Builder()
                .forBrowser('firefox')
                .setFirefoxOptions(this.#driverOptions)
                .build();

            this.#data = await this.retrieveDataUsage();
            this.saveCookies();
            this.emit(DATA_UPDATED, this.#data);
        } catch (e) {
            console.error(`Driver Error: ${e}`);
            this.clearCookies();
        } finally {
            this.#driver?.quit();
        }

        console.log(
            `Next fetch in ${this.#interval} minutes @ ${new Date(
                Date.now() + this.#intervalMs
            ).toLocaleTimeString()}`
        );
    }

    private async retrieveDataUsage() {
        this.isRunning = true;
        let data = await this.getJson();
        while (
            data.error === 'unauthenticated' ||
            data.logged_in_within_limit === false
        ) {
            console.info('Not logged in');
            this.clearCookies();
            await this.authenticate();
            data = await this.getJson();
        }
        console.log('Data updated');
        this.isRunning = false;
        return data;
    }

    private async getJson() {
        console.info(`Loading Usage ${JSON_URL}`);

        await this.loadCookies();
        await this.#driver!.get(JSON_URL);
        await this.#driver!.wait(async () => {
            const title = await this.getTitle();
            return title === '';
        });

        const ele = await this.#driver!.findElement(By.tagName('pre'));
        const text = await ele.getText();
        let jsonData;
        try {
            jsonData = JSON.parse(text);
        } catch (e) {
            console.log('Bad JSON', text);
        }

        return jsonData;
    }

    private async authenticate() {
        console.info(`Loading (${LOGIN_URL})`);

        await this.#driver!.get(LOGIN_URL);
        await this.waitForPageToLoad();
        await this.#driver!.wait(until.elementLocated(By.id('user')), 5 * 1000);
        await this.sendKeysToId('user', this.#user);
        await this.sendKeysToId('passwd', this.#password);
        await this.clickId('sign_in');
        await this.waitForPageToLoad();
        await this.logTitle();
    }

    private async sendKeysToId(id: string, text: string) {
        try {
            const element = await this.#driver!.findElement(By.id(id));
            const elementType = await element.getAttribute('type');
            if (elementType === 'text' || elementType === 'password') {
                await element.clear();
                await element.sendKeys(text);
            } else {
                console.log(
                    `Element ${id} is of type ${elementType} not sending keys`
                );
            }
        } catch (e) {
            console.error(e);
        }
    }

    private async clickId(id: string) {
        const element = await this.#driver!.findElement(By.id(id));
        await element.click();
    }

    private async waitForPageToLoad() {
        return await this.#driver!.wait(async () => {
            const readyState = await this.#driver!.executeScript(
                'return document.readyState'
            );
            return readyState === 'complete';
        });
    }

    private async getTitle() {
        return await this.#driver!.getTitle();
    }

    private async logTitle() {
        const title = await this.getTitle();
        console.info(`Page Title: ${title}`);
    }

    private async logSource() {
        const source = await this.#driver!.getPageSource();
        console.log(source);
    }

    private async loadCookies() {
        try {
            await fs.lstat(COOKIES_FILE);
            console.log('Loading Cookies');
            await this.#driver!.get(JSON_URL);
            const fileData = await fs.readFile(COOKIES_FILE, 'utf8');
            const cookies = JSON.parse(fileData);
            for (const cookie of cookies) {
                await this.#driver!.manage().addCookie(cookie);
            }
        } catch (e) {
            // Cookie file not found
            if (e.code == 'ENOENT') return;

            console.error('Error Loading Cookies:', e);
        }
    }

    private async saveCookies() {
        const cookies = await this.#driver!.manage().getCookies();
        try {
            console.log('Saving Cookies');
            await fs.writeFile(COOKIES_FILE, JSON.stringify(cookies));
        } catch (error) {
            console.error('Error Saving Cookies:', error);
        }
    }

    private async clearCookies() {
        console.log('Clearing Cookies');
        try {
            await this.#driver!.manage().deleteAllCookies();
            await fs.unlink(COOKIES_FILE);
        } catch (e) {}
    }
}
