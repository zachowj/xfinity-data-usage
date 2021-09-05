import { readFileSync, writeFile } from 'fs';
import puppeteer from 'puppeteer-core';

const COOKIES_FILE = '/config/cookies.json';

export default class Cookies {
    readCookies(): Array<puppeteer.Protocol.Network.CookieParam> {
        try {
            const data = readFileSync(COOKIES_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (e: any) {
            console.log('Unable to load cookies file.');
            return [];
        }
    }

    async writeCookies(cookies: Array<puppeteer.Protocol.Network.CookieParam>): Promise<void> {
        return writeFile(COOKIES_FILE, JSON.stringify(cookies), (error) => {
            if (error) {
                console.error('Unable to write cookies files.', error);
            }
        });
    }
}
