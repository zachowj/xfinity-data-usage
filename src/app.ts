import Request from 'request';

import { Config } from './config.js';
import logger from './logger.js';
import { mqtt as MQTT } from './mqtt.js';
import { createServer, UpdateHttp } from './server.js';
import { Xfinity, xfinityUsage } from './xfinity.js';

let config: Config;
try {
    config = new Config();
} catch (e: any) {
    logger.error(e.message);
    process.exit(1);
}

const { xfinity: xfinityConfig, mqtt: mqttConfig, imap: imapConfig } = config.getConfig();

let updateHttp: UpdateHttp | undefined;
if (config.useHttp) {
    updateHttp = createServer();
}

let mqtt: MQTT | undefined;
if (config.useMqtt && mqttConfig) {
    mqtt = new MQTT(mqttConfig);
}

const dataUpdated = (usage: xfinityUsage) => {
    updateHttp && updateHttp(usage);

    mqtt?.update(usage);

    if (config.usePost) {
        logger.verbose(`Posting to ${config.postUrl}`);
        Request.post(config.postUrl, { json: usage }, (error) => {
            if (error) {
                logger.error(`Couldn't post to ${config.postUrl}. Error: ${error.code}`);
            }
        });
    }
};

const intervalMs = xfinityConfig.interval * 60000;
const xfinity = new Xfinity(xfinityConfig, imapConfig);
const fetch = async () => {
    const nextAt = new Date(Date.now() + intervalMs).toLocaleTimeString();
    try {
        const data = await xfinity.fetch();
        const currentMonth = data.usageMonths[data.usageMonths.length - 1];
        logger.info(
            `Usage updated: ${currentMonth.totalUsage} ${currentMonth.unitOfMeasure}. Next update at ${nextAt}`,
        );
        dataUpdated(data);
    } catch (e: unknown) {
        logger.error(`${e}. Next update at ${nextAt}`);
    }
};
fetch();
setInterval(fetch, intervalMs);
