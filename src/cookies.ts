import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import puppeteer from 'puppeteer-core';

import { CONFIG_FOLDER } from './config.js';
import logger from './logger.js';

const COOKIES_FILE = CONFIG_FOLDER + '/cookies.json';

export const readCookies = (): Array<puppeteer.Protocol.Network.CookieParam> => {
    try {
        const data = readFileSync(COOKIES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e: any) {
        if (e.code !== 'ENOENT') {
            logger.error('Unable to load cookies file.');
        }
        return [];
    }
};

export const writeCookies = async (cookies: Array<puppeteer.Protocol.Network.CookieParam>): Promise<void> => {
    try {
        await writeFile(COOKIES_FILE, JSON.stringify(cookies));
    } catch (error) {
        logger.error(`Unable to write cookies files. ${error}`);
    }
};
