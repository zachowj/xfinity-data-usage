import Http from 'http';
import Request from 'request';
import URL from 'url';

import { Config } from './config';
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
    Http.createServer(async (req, res) => {
        const url = URL.parse(req.url || '');
        const path = url.pathname;

        if (path !== '/') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 Not Found\n');
            res.end();
            return;
        }

        const statusCode = 200;
        const data = await xfinity.getData();
        console.log('HTTP request made');
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
    }).listen(7878);
    console.log('http server started');
}

if (config.usePost) {
    xfinity.addListener(DATA_UPDATED, (data) => {
        console.log(`Posting to ${config.postUrl}`);
        Request.post(config.postUrl, { json: data }, (error, res) => {
            if (error) {
                console.log(
                    `Couldn't post to ${config.postUrl}. Error: ${error.code}`
                );
            }
        });
    });
}
