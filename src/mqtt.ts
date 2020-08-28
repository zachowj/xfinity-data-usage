import MQTT from 'async-mqtt';

import { mqttConfig } from './config';

export class mqtt {
    #client: MQTT.AsyncMqttClient;
    #config: mqttConfig;

    constructor(config: mqttConfig) {
        this.#config = config;
        const port = config.port || 1883;

        let mqttOptions;
        if (config.username !== undefined || config.password !== undefined) {
            mqttOptions = {
                username: config.username,
                password: config.password,
            };
        }

        this.#client = MQTT.connect(
            `mqtt://${this.#config.host}:${port}`,
            mqttOptions
        );
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
        const payload = {
            name: 'Xfinity Usage',
            state_topic: this.stateTopic,
            json_attributes_topic: this.attriubtesTopic,
            unit_of_measurement: 'GB',
            icon: 'mdi:network',
        };
        await this.publish(this.configTopic, payload);
    }

    private async publish(topic: string, data: any) {
        // console.log(`MQTT: ${topic}`, data);
        const options = {
            retain: true,
        };

        try {
            await this.#client.publish(topic, JSON.stringify(data), options);
        } catch (e) {
            console.log(topic, e.stack);
        }
    }

    update(data: any) {
        console.log('Updating MQTT');
        if (this.usingHomeAssistant) {
            try {
                this.updateHomeAssistant(data);
            } catch (e) {
                console.log(e);
            }
        } else {
            this.publish(this.topic, data);
        }
    }

    private updateHomeAssistant(data: any) {
        const [current] = data.usageMonths.slice(-1);
        let attributes = {};
        if (!current) {
            throw new Error('Current month usage not found in data');
        }

        attributes = {
            allowable_usage: current.allowableUsage,
            homeUsage: current.homeUsage,
            wifiUsasge: current.wifiUsage,
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
