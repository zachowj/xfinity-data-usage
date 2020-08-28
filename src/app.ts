import Request from 'request';

import { Config } from './config';
import { mqtt as MQTT } from './mqtt';
import { createServer } from './server';
import { Xfinity, DATA_UPDATED } from './xfinity';

let config: any;
try {
    config = new Config();
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

const { xfinity: xfinityConfig, mqtt: mqttConfig } = config.getConfig();
const xfinity = new Xfinity(xfinityConfig);
xfinity.start();

if (config.useHttp) {
    createServer(xfinity);
}

if (config.useMqtt) {
    const mqtt = new MQTT(mqttConfig);
    xfinity.addListener(DATA_UPDATED, mqtt.update.bind(mqtt));
}

if (config.usePost) {
    xfinity.addListener(DATA_UPDATED, (data) => {
        console.log(`Posting to ${config.postUrl}`);
        Request.post(config.postUrl, { json: data }, (error) => {
            if (error) {
                console.log(
                    `Couldn't post to ${config.postUrl}. Error: ${error.code}`
                );
            }
        });
    });
}
