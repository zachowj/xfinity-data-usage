import deepmerge from 'deepmerge';
import fs from 'fs';
import yaml from 'js-yaml';

import { imapConfig } from './imap.js';
import logger from './logger.js';
import { mqttConfig } from './mqtt.js';
import { xfinityConfig } from './xfinity.js';

const CONFIG_FOLDER = process.env.CONFIG_FOLDER ?? '/config';

interface config {
    xfinity: xfinityConfig;
    http?: null;
    post?: {
        url: string;
    };
    mqtt?: mqttConfig;
    imap?: imapConfig;
}

interface defaultConfig {
    xfinity: {
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
    #config: config;

    constructor() {
        const diskConfig = this.loadConfig();
        this.#config = deepmerge(defaultConfig as config, diskConfig);

        if (!this.useHttp && !this.usePost) {
            throw new Error('No output defined in the config. (http, post)');
        }

        this.print();
    }

    loadConfig(): config {
        let config: config;
        try {
            config = yaml.load(fs.readFileSync(CONFIG_FOLDER + '/config.yml', 'utf8')) as config;
        } catch (e) {
            throw new Error('Config file not found.');
        }

        if (config.xfinity?.username === undefined) {
            throw new Error('Xfinity username needs to be defined in the config.');
        }

        if (config.xfinity?.password === undefined) {
            throw new Error('Xfinity password needs to be defined in the config.');
        }

        if (config.mqtt !== undefined) {
            if (config.mqtt.host === undefined) {
                throw new Error('MQTT needs host defined in the config.');
            }
            if (config.mqtt.topic === undefined && config.mqtt.homeassistant === undefined) {
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
        logger.info(`Xfinity Update every ${this.#config.xfinity.interval} mins`);
        if (this.useHttp) {
            logger.info('Http server will be started');
        }
        if (this.usePost) {
            logger.info(`Will post to ${this.#config?.post?.url} on new data`);
        }
        if (this.useMqtt) {
            logger.info(`Will publish to MQTT ${this.useMqttHomeAssistant ? '(Home Assistant)' : ''} on new data`);
        }
    }
}
