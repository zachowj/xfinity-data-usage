import { EventEmitter } from 'events';
import firefox from 'selenium-webdriver/firefox';
import webdriver, { By, until } from 'selenium-webdriver';

const JSON_URL = 'https://customer.xfinity.com/apis/services/internet/usage';
const LOGIN_URL = 'https://customer.xfinity.com';
export const DATA_UPDATED = 'dataUpdated';

interface xfinityConfig {
    user: string;
    password: string;
    interval: number;
}

export class Xfinity extends EventEmitter {
    driver: webdriver.ThenableWebDriver;
    intervalId: NodeJS.Timeout | undefined;
    isRunning: boolean = false;
    data: Object;
    password: string;
    user: string;
    interval: number;
    intervalMs: number;

    constructor({ user, password, interval }: xfinityConfig) {
        super();

        const options = new firefox.Options()
            .setPreference('devtools.jsonview.enabled', false)
            .setPreference('dom.webdriver.enabled', false);
        options.addArguments('-headless');

        this.driver = new webdriver.Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();

        this.data = {};
        this.user = user;
        this.password = password;
        this.interval = interval;
        this.intervalMs = interval * 60000;
    }

    async start() {
        this.fetch();
        this.intervalId = setInterval(this.fetch.bind(this), this.intervalMs);
    }

    getData() {
        return this.data;
    }

    async fetch() {
        console.log('Fetching Data');
        this.data = await this.retrieveDataUsage();
        this.emit(DATA_UPDATED, this.data);
        console.log(
            `Next fetch in ${this.interval} minutes @ ${new Date(
                Date.now() + this.intervalMs
            ).toTimeString()}`
        );
    }

    async retrieveDataUsage() {
        this.isRunning = true;
        let data = await this.getJson();
        while (
            data.error === 'unauthenticated' ||
            data.logged_in_within_limit === false
        ) {
            console.info('Not logged in');
            await this.authenticate();
            data = await this.getJson();
        }
        this.isRunning = false;
        return data;
    }

    async getJson() {
        console.info(`Loading Usage ${JSON_URL}`);

        await this.driver.get(JSON_URL);
        await this.driver.wait(async () => {
            const title = await this.getTitle();
            return title === '';
        });

        // const source = await this.driver.getPageSource();
        // console.log(source);

        const ele = await this.driver.findElement(By.tagName('pre'));
        const text = await ele.getText();
        let jsonData;
        try {
            jsonData = JSON.parse(text);
        } catch (e) {
            console.log('bad text', text);
        }

        return jsonData;
    }

    async authenticate() {
        console.info(`Loading (${LOGIN_URL})`);

        await this.driver.get(LOGIN_URL);
        await this.waitForPageToLoad();
        await this.driver.wait(until.elementLocated(By.id('user')), 5 * 1000);

        // const source = await this.driver.getPageSource();
        // console.log(source);

        await this.sendKeysToId('user', this.user);
        await this.sendKeysToId('passwd', this.password);
        await this.clickId('sign_in');
        await this.waitForPageToLoad();
        await this.logTitle();
    }

    async sendKeysToId(id: string, text: string) {
        try {
            const element = await this.driver.findElement(By.id(id));
            element.clear();
            element.sendKeys(text);
        } catch (e) {
            console.error(e);
        }
    }

    async clickId(id: string) {
        const element = await this.driver.findElement(By.id(id));
        await element.click();
    }

    async waitForPageToLoad() {
        return await this.driver.wait(async () => {
            const readyState = await this.driver.executeScript(
                'return document.readyState'
            );
            return readyState === 'complete';
        });
    }

    async getTitle() {
        return await this.driver.getTitle();
    }

    async logTitle() {
        console.info(await this.getTitle());
    }
}
