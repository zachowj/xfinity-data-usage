import { readFileSync, writeFile } from 'fs';

import logger from './logger.js';

const CONFIG_FOLDER = process.env.CONFIG_FOLDER ?? '/config';
const SUFFIX_FILE = CONFIG_FOLDER + '/pwsuffix';

export default class Password {
    private password: string;
    private suffix: number | undefined;

    constructor(password: string) {
        this.password = password;
        this.readPasswordFile();
    }

    readPasswordFile(): void {
        let suffix: number | undefined;

        try {
            const data = readFileSync(SUFFIX_FILE, 'utf-8');
            suffix = parseInt(data, 10);
        } catch (e) {
            logger.error('Unable to load password file.');
        }

        this.suffix = suffix;
    }

    getPassword(): string {
        const suffix = this.suffix?.toString().padStart(3, '0') ?? '';

        return `${this.password}${suffix}`;
    }

    generatePassword(): string {
        this.suffix = this.suffix !== undefined ? this.suffix + 1 : 0;
        return this.getPassword();
    }

    async savePassword(): Promise<void> {
        if (this.suffix === undefined) return;

        await writeFile(SUFFIX_FILE, this.suffix.toString(), (error) => {
            if (error) {
                console.error(error);
                console.error('Error trying to write password suffix to file.');
            }
        });
    }
}
