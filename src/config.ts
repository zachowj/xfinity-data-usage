import deepmerge from 'deepmerge';
import fs from 'fs';
import yaml from 'js-yaml';

import { mqttConfig } from './mqtt';
import { xfinityConfig } from './xfinity';

interface config {
    xfinity: xfinityConfig;
    http?: null;
    post?: {
        url: string;
    };
    mqtt?: mqttConfig;
}

interface defaultConfig {
    xfinity: {
        username?: string;
        password?: string;
        interval: number;
        pageTimeout: number;
    };
}

const defaultConfig: defaultConfig = {
    xfinity: {
        interval: 60,
        pageTimeout: 30,
    },
};

export class Config {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #config: config;

    constructor() {
        const diskConfig = this.loadConfig();
        this.#config = deepmerge(defaultConfig, diskConfig);

        if (!this.useHttp && !this.usePost) {
            throw new Error('No output defined in the config. (http, post)');
        }

        this.print();
    }

    loadConfig(): config {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let config: any;
        try {
            config = yaml.safeLoad(fs.readFileSync('/config/config.yml', 'utf8'));
        } catch (e) {
            throw new Error('Config file not found.');
        }

        if (config.xfinity.user === undefined) throw new Error('Xfinity User needs to be defined in the config.');

        if (config.xfinity.password === undefined)
            throw new Error('Xfinity Password needs to be defined in the config.');

        if (config.mqtt !== undefined) {
            if (config.mqtt?.host === undefined) {
                throw new Error('MQTT needs host defined in the config.');
            }
            if (config.mqtt?.topic === undefined && config.mqtt?.homeassistant === undefined) {
                throw new Error('MQTT topic or homeassistant need to be defined in the config.');
            }
        }
        return config;
    }

    getConfig(): config {
        return this.#config;
    }

    get useHttp(): boolean {
        return this.#config.http !== undefined;
    }

    get useMqtt(): boolean {
        return !!this.#config.mqtt;
    }

    get useMqttHomeAssistant(): boolean {
        return !!this.#config.mqtt?.homeassistant !== undefined;
    }

    get usePost(): boolean {
        return !!this.#config.post?.url;
    }

    get postUrl(): string {
        return this.#config.post?.url ?? '';
    }

    print(): void {
        console.info('-- Config --');
        console.info(`Xfinity Update every ${this.#config.xfinity.interval} mins`);
        if (this.useHttp) {
            console.log('Http server will be started');
        }
        if (this.usePost) {
            console.log(`Will post to ${this.#config?.post?.url} on new data`);
        }
        if (this.useMqtt) {
            console.log(`Will publish to MQTT ${this.useMqttHomeAssistant ? '(Home Assistant)' : ''} on new data`);
        }
        console.log('--------');
    }
}
