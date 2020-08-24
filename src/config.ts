import deepmerge from 'deepmerge';
import fs from 'fs';
import yaml from 'js-yaml';

interface config {
    xfinity: {
        user: string;
        password: string;
        interval?: number;
    };
    http?: null;
    post?: {
        url: string;
    };
}

interface defaultConfig {
    xfinity: {
        interval: number;
    };
}

const defaultConfig: defaultConfig = {
    xfinity: {
        interval: 60,
    },
};

export class Config {
    #config: any;

    constructor() {
        const diskConfig = this.loadConfig();
        this.#config = deepmerge(defaultConfig, diskConfig);

        if (!this.useHttp && !this.usePost) {
            throw new Error('No output defined in the config. (http, post)');
        }

        this.print();
    }

    loadConfig() {
        let config: any;
        try {
            config = yaml.safeLoad(
                fs.readFileSync('/config/config.yml', 'utf8')
            );
        } catch (e) {
            throw new Error('Config file not found.');
        }

        if (config.xfinity.user === undefined)
            throw new Error('User needs to be defined in the config.');

        if (config.xfinity.password === undefined)
            throw new Error('Password needs to be defined in the config.');

        return config;
    }

    getConfig() {
        return this.#config;
    }

    get useHttp(): boolean {
        return this.#config.http !== undefined;
    }

    get usePost(): boolean {
        return !!this.#config.post?.url;
    }

    get postUrl(): string | undefined {
        return this.#config.post?.url;
    }

    print() {
        console.log(this.#config);
        console.info('-- Config --');
        console.info(
            `Xfinity Update every ${this.#config.xfinity.interval} mins`
        );
        if (this.useHttp) {
            console.log('Http server will be started');
        }
        if (this.usePost) {
            console.log(`Will post to ${this.#config.post.url} on new data`);
        }
        console.log('--------');
    }
}
