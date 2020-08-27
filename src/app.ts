import Request from 'request';

import { Config } from './config';
import { createServer } from './server';
import { Xfinity, DATA_UPDATED } from './xfinity';

let config: any;
try {
    config = new Config();
} catch (e) {
    console.log(e.message);
    process.exit(1);
}

const { xfinity: xfinityConfig } = config.getConfig();
const xfinity = new Xfinity(xfinityConfig);
xfinity.start();

if (config.useHttp) {
    createServer(xfinity);
}

xfinity.addListener(DATA_UPDATED, (data) => {
    if (config.usePost) {
        console.log(`Posting to ${config.postUrl}`);
        Request.post(config.postUrl, { json: data }, (error) => {
            if (error) {
                console.log(
                    `Couldn't post to ${config.postUrl}. Error: ${error.code}`
                );
            }
        });
    }
});
