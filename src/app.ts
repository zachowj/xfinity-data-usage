import Request from 'request';

import { Config } from './config.js';
import { mqtt as MQTT } from './mqtt.js';
import { createServer } from './server.js';
import { Xfinity, DATA_UPDATED } from './xfinity.js';

let config: Config;
try {
    config = new Config();
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

const { xfinity: xfinityConfig, mqtt: mqttConfig, imap: imapConfig } = config.getConfig();
const xfinity = new Xfinity(xfinityConfig, imapConfig);
xfinity.start();

if (config.useHttp) {
    createServer(xfinity);
}

if (config.useMqtt && mqttConfig) {
    const mqtt = new MQTT(mqttConfig);
    xfinity.addListener(DATA_UPDATED, mqtt.update.bind(mqtt));
}

if (config.usePost) {
    xfinity.addListener(DATA_UPDATED, (data) => {
        console.log(`Posting to ${config.postUrl}`);
        Request.post(config.postUrl, { json: data }, (error) => {
            if (error) {
                console.log(`Couldn't post to ${config.postUrl}. Error: ${error.code}`);
            }
        });
    });
}
