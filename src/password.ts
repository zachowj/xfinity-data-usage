import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

import { CONFIG_FOLDER } from './config.js';
import logger from './logger.js';

const SUFFIX_FILE = CONFIG_FOLDER + '/pwsuffix';

export default class Password {
    #password: string;
    #suffix?: number;

    constructor(password: string) {
        this.#password = password;
        this.readPasswordFile();
    }

    readPasswordFile(): void {
        try {
            const data = readFileSync(SUFFIX_FILE, 'utf-8');
            this.#suffix = parseInt(data, 10);
        } catch (e) {
            logger.error('Unable to load password file.');
        }
    }

    getPassword(): string {
        const suffix = this.#suffix?.toString().padStart(3, '0') ?? '';

        return `${this.#password}${suffix}`;
    }

    generatePassword(): string {
        this.#suffix = this.#suffix !== undefined ? this.#suffix + 1 : 0;
        return this.getPassword();
    }

    async savePassword(): Promise<void> {
        if (this.#suffix === undefined) return;

        try {
            await writeFile(SUFFIX_FILE, this.#suffix.toString());
        } catch (error) {
            logger.error(`Error trying to write password suffix to file. ${error}`);
        }
    }
}
