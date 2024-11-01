import axios from 'axios';

import { Config } from './config.js';
import logger from './logger.js';
import { mqtt as MQTT } from './mqtt.js';
import { createServer, UpdateHttp } from './server.js';
import { getTimeout, isAccessDenied, nextAtString } from './utils.js';
import { Xfinity, XfinityUsage } from './xfinity.js';

let config: Config;
try {
    config = new Config();
} catch (e: any) {
    logger.error(e.message);
    process.exit(1);
}

const { xfinity: xfinityConfig, mqtt: mqttConfig } = config.getConfig();

let updateHttp: UpdateHttp | undefined;
if (config.useHttp) {
    updateHttp = createServer();
}

let mqtt: MQTT | undefined;
if (config.useMqtt && mqttConfig) {
    mqtt = new MQTT(mqttConfig);
}

const dataUpdated = (usage: XfinityUsage) => {
    updateHttp?.(usage);

    mqtt?.update(usage);

    if (config.usePost) {
        logger.verbose(`Posting to ${config.postUrl}`);
        axios.post(config.postUrl, usage).catch((error) => {
            if (error) {
                logger.error(`Couldn't post to ${config.postUrl}. Error: ${error.code}`);
            }
        });
    }
};

const SIX_HOURS = 2.16e7;
const intervalMs = xfinityConfig.interval * 60000;
const xfinity = new Xfinity(xfinityConfig);
let interation = 0;
const fetch = async () => {
    const nextAt = nextAtString(intervalMs);
    try {
        const data = await xfinity.fetch();
        const currentMonth = data.usageMonths[data.usageMonths.length - 1];
        logger.info(
            `Usage updated: ${currentMonth.totalUsage} ${currentMonth.unitOfMeasure}. Next update at ${nextAt}`,
        );
        dataUpdated(data);
        interation = 0;
    } catch (e: unknown) {
        if (isAccessDenied(e)) {
            logger.error(
                `Access Denied. Waiting 6 hours before trying again. Next update at ${nextAtString(SIX_HOURS)}`,
            );
            interation++;
        } else {
            logger.error(`${e}. Next update at ${nextAt}`);
            interation = 0;
        }
    }

    setTimeout(fetch, getTimeout(intervalMs, interation));
};
fetch();
