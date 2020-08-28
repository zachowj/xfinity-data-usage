import Http from 'http';
import URL from 'url';

import { Xfinity } from './xfinity';

export const createServer = (xfinity: Xfinity) => {
    Http.createServer(async (req, res) => {
        const url = URL.parse(req.url || '');
        const path = url.pathname;
        const homeassistant = path === '/homeassistant';

        console.log(`HTTP request: ${path}`);

        if (path !== '/' && !homeassistant) {
            res.writeHead(404);
            res.end();
            return;
        }

        let data = await xfinity.getData();

        if (Object.keys(data).length === 0) {
            res.writeHead(503);
            res.end();
            return;
        }

        if (homeassistant) {
            const [current] = data.usageMonths.slice(-1);
            data = {
                total_usage: current.totalUsage,
                allowable_usage: current.allowableUsage,
                homeUsage: current.homeUsage,
                wifiUsasge: current.wifiUsage,
                courtesy_used: data.courtesyUsed,
                courtesy_remaining: data.courtesyRemaining,
                courtesy_allowed: data.courtesyAllowed,
                in_paid_overage: data.inPaidOverage,
                remaining_usage: current.allowableUsage - current.totalUsage,
            };
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(data));
        res.end();
    }).listen(7878);
    console.log('http server started');
};
