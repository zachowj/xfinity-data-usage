import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import { Cookie } from 'playwright';

import { CONFIG_FOLDER } from './config.js';
import logger from './logger.js';

const COOKIES_FILE = CONFIG_FOLDER + '/cookies.json';

export const readCookies = (): Cookie[] => {
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

export const writeCookies = async (cookies: Cookie[]): Promise<void> => {
    try {
        await writeFile(COOKIES_FILE, JSON.stringify(cookies));
    } catch (error) {
        logger.error(`Unable to write cookies files. ${error}`);
    }
};
