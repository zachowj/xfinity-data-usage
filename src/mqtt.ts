/* eslint-disable camelcase */
import MQTT from 'async-mqtt';

import logger from './logger.js';
import { XfinityUsage } from './xfinity.js';

export interface mqttConfig {
    host: string;
    port?: number;

    username?: string;
    password?: string;
    topic?: string;
    homeassistant?: {
        prefix?: string;
    };
}

interface homeassistantTopicData {
    name: string;
    state_topic: string;
    json_attributes_topic: string;
    unit_of_measurement: string;
    icon: string;
    force_update: boolean;
    unique_id: string;
}

export interface homeassistantAttributesData {
    total_usage?: number;
    allowable_usage: number;
    home_usage: number;
    wifi_usage: number;
    courtesy_used: number;
    courtesy_remaining: number;
    courtesy_allowed: number;
    in_paid_overage: boolean;
    remaining_usage: number;
}

export class mqtt {
    #client: MQTT.AsyncMqttClient;
    #config: mqttConfig;

    constructor(config: mqttConfig) {
        this.#config = config;
        const port = config.port ?? 1883;

        let mqttOptions;
        if (config.username !== undefined || config.password !== undefined) {
            mqttOptions = {
                username: config.username,
                password: config.password,
            };
        }

        this.#client = MQTT.connect(`mqtt://${this.#config.host}:${port}`, mqttOptions);
        if (this.usingHomeAssistant) {
            this.#client.on('connect', this.onConnect.bind(this));
        }
    }

    private get attriubtesTopic(): string {
        return `${this.topicPrefix}attributes`;
    }

    private get configTopic(): string {
        return `${this.topicPrefix}config`;
    }

    private get stateTopic(): string {
        return `${this.topicPrefix}state`;
    }

    private get topic(): string {
        return this.#config.topic || '';
    }

    private get topicPrefix(): string {
        const prefix = this.#config.homeassistant?.prefix || 'homeassistant';

        return `${prefix}/sensor/xfinity/`;
    }

    private get usingHomeAssistant(): boolean {
        return this.#config.homeassistant !== undefined;
    }

    private async onConnect() {
        logger.info('Connected to MQTT');
        const payload: homeassistantTopicData = {
            name: 'Xfinity Usage',
            state_topic: this.stateTopic,
            json_attributes_topic: this.attriubtesTopic,
            unit_of_measurement: 'GB',
            icon: 'mdi:network',
            force_update: true,
            unique_id: 'xfinity_usage_sensor',
        };
        await this.publish(this.configTopic, payload);
    }

    private async publish(
        topic: string,
        data: XfinityUsage | homeassistantTopicData | homeassistantAttributesData | number,
    ) {
        const options = {
            retain: true,
        };

        try {
            await this.#client.publish(topic, JSON.stringify(data), options);
        } catch (e: any) {
            logger.error(`${topic} ${e.stack}`);
        }
    }

    update(data: XfinityUsage): void {
        logger.verbose('Updating MQTT');
        if (this.usingHomeAssistant) {
            try {
                this.updateHomeAssistant(data);
            } catch (e: any) {
                logger.error(e);
            }
        } else {
            this.publish(this.topic, data);
        }
    }

    private updateHomeAssistant(data: XfinityUsage) {
        const [current] = data.usageMonths.slice(-1);
        if (!current) {
            throw new Error('Current month usage not found in data');
        }

        const attributes: homeassistantAttributesData = {
            allowable_usage: current.allowableUsage,
            home_usage: current.homeUsage,
            wifi_usage: current.wifiUsage,
            courtesy_used: data.courtesyUsed,
            courtesy_remaining: data.courtesyRemaining,
            courtesy_allowed: data.courtesyAllowed,
            in_paid_overage: data.inPaidOverage,
            remaining_usage: current.allowableUsage - current.totalUsage,
        };

        this.publish(this.stateTopic, current.totalUsage);
        this.publish(this.attriubtesTopic, attributes);
    }
}
