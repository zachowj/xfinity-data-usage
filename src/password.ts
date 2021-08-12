import { readFileSync, writeFile } from 'fs';

const SUFFIX_FILE = '/config/pwsuffix';

export default class Password {
    private password: string;
    private suffix = 0;

    constructor(password: string) {
        this.password = password;
        this.readPasswordFile();
    }

    readPasswordFile(): void {
        let suffix: number;

        try {
            const data = readFileSync(SUFFIX_FILE, 'utf-8');
            console.log(data);
            suffix = parseInt(data, 10);
        } catch (e) {
            console.log('Unable to load password file.');
            suffix = 0;
        }

        this.suffix = suffix;
    }

    getPassword(): string {
        const suffix = this.suffix.toString().padStart(3, '0');

        return `${this.password}${suffix}`;
    }

    generatePassword(): string {
        this.suffix++;
        return this.getPassword();
    }

    async savePassword(): Promise<void> {
        await writeFile(SUFFIX_FILE, this.suffix.toString(), (error) => {
            if (error) {
                console.error(error);
                console.error('Error trying to write password suffix to file.');
            }
        });
    }
}
