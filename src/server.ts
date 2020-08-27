import Http from 'http';
import URL from 'url';

import { Xfinity } from './xfinity';

export const createServer = (xfinity: Xfinity) => {
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
};
