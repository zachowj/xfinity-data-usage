import { readFileSync, writeFile } from 'fs';
import puppeteer from 'puppeteer-core';

import logger from './logger.js';

const CONFIG_FOLDER = process.env.CONFIG_FOLDER ?? '/config';
const COOKIES_FILE = CONFIG_FOLDER + '/cookies.json';

export default class Cookies {
    readCookies(): Array<puppeteer.Protocol.Network.CookieParam> {
        try {
            const data = readFileSync(COOKIES_FILE, 'utf-8');
            return JSON.parse(data);
        } catch (e: any) {
            if (e.code !== 'ENOENT') {
                logger.error('Unable to load cookies file.');
            }
            return [];
        }
    }

    async writeCookies(cookies: Array<puppeteer.Protocol.Network.CookieParam>): Promise<void> {
        return writeFile(COOKIES_FILE, JSON.stringify(cookies), (error) => {
            if (error) {
                logger.error('Unable to write cookies files.', error);
            }
        });
    }
}
