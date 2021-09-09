import { fork } from 'child_process';
import path from 'path';
import Request from 'request';
import { fileURLToPath } from 'url';

import { Config } from './config.js';
import logger from './logger.js';
import { mqtt as MQTT } from './mqtt.js';
import { createServer } from './server.js';
import { xfinityUsage } from './xfinity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export let usage: xfinityUsage | undefined;

let config: Config;
try {
    config = new Config();
} catch (e: any) {
    logger.error(e.message);
    process.exit(1);
}

const { xfinity: xfinityConfig, mqtt: mqttConfig, imap: imapConfig } = config.getConfig();

if (config.useHttp) {
    createServer();
}

let mqtt: MQTT | undefined;
if (config.useMqtt && mqttConfig) {
    mqtt = new MQTT(mqttConfig);
}

const dataUpdated = () => {
    if (usage) {
        mqtt?.update(usage);

        if (config.usePost) {
            logger.verbose(`Posting to ${config.postUrl}`);
            Request.post(config.postUrl, { json: usage }, (error) => {
                if (error) {
                    logger.error(`Couldn't post to ${config.postUrl}. Error: ${error.code}`);
                }
            });
        }
    }
};

const intervalMs = xfinityConfig.interval * 60000;
const fetch = () => {
    const nextAt = new Date(Date.now() + intervalMs).toLocaleTimeString();
    const xfinity = fork(path.join(__dirname, '/fetch-usage'), undefined, { detached: true });
    xfinity.on('message', (data: Record<string, unknown>) => {
        const type = data.type as string;
        switch (type) {
            case 'loaded':
                xfinity.send({ type: 'start', xfinityConfig, imapConfig });
                break;
            case 'usage': {
                usage = data.usage as xfinityUsage;
                const currentMonth = usage.usageMonths[usage.usageMonths.length - 1];
                logger.info(
                    `Usage updated: ${currentMonth.totalUsage} ${currentMonth.unitOfMeasure}. Next update in ${xfinityConfig.interval} minutes @ ${nextAt}`,
                );
                dataUpdated();
                break;
            }
            case 'error':
                logger.error(data.message);
                logger.info(`Next update in ${xfinityConfig.interval} minutes @ ${nextAt}`);
                break;
        }
        if (['usage', 'error'].includes(type)) {
            xfinity.kill();
        }
    });
};
fetch();
setInterval(fetch, intervalMs);
