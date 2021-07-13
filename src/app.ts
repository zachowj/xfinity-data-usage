import { fork } from 'child_process';
import { EventEmitter } from 'events';
import path from 'path';
import Request from 'request';
import { fileURLToPath } from 'url';

import { Config } from './config.js';
import { mqtt as MQTT } from './mqtt.js';
import { createServer } from './server.js';
import { xfinityUsage } from './xfinity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const eventBus = new EventEmitter();
export const DATA_UPDATED = 'dataUpdated';

let config: Config;
try {
    config = new Config();
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

export let usage: xfinityUsage | undefined;
const { xfinity: xfinityConfig, mqtt: mqttConfig, imap: imapConfig } = config.getConfig();
const intervalMs = xfinityConfig.interval * 60000;
const fetch = () => {
    const nextAt = new Date(Date.now() + intervalMs).toLocaleTimeString();
    const xfinity = fork(path.join(__dirname, '/fetch-usage'));
    xfinity.on('message', (data: Record<string, unknown>) => {
        const type = data.type as string;
        switch (type) {
            case 'loaded':
                xfinity.send({ type: 'start', xfinityConfig, imapConfig });
                break;
            case 'usage':
                console.log('Usage updated');
                usage = data.usage as xfinityUsage;
                eventBus.emit(DATA_UPDATED, data.usage);
                break;
            case 'error':
                console.error('Error while fetching usage');
                console.error(data.message);
                break;
        }
        if (['usage', 'error'].includes(type)) {
            xfinity.kill();
            console.log(`Next fetch in ${xfinityConfig.interval} minutes @ ${nextAt}`);
        }
    });
    xfinity.unref();
};
fetch();
setInterval(fetch, intervalMs);

if (config.useHttp) {
    createServer();
}

if (config.useMqtt && mqttConfig) {
    const mqtt = new MQTT(mqttConfig);
    eventBus.addListener(DATA_UPDATED, mqtt.update.bind(mqtt));
}

if (config.usePost) {
    eventBus.addListener(DATA_UPDATED, (data) => {
        console.log(`Posting to ${config.postUrl}`);
        Request.post(config.postUrl, { json: data }, (error) => {
            if (error) {
                console.log(`Couldn't post to ${config.postUrl}. Error: ${error.code}`);
            }
        });
    });
}
