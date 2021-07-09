import EventEmitter from 'events';
import Http from 'http';
import { URL } from 'url';

import { DATA_UPDATED } from './app.js';
import { xfinityUsage } from './xfinity.js';

let usage: xfinityUsage | undefined;

export const createServer = (eventBus: EventEmitter): void => {
    Http.createServer((req, res) => {
        const url = new URL(req.url ?? '');
        const path = url.pathname;
        const homeassistant = path === '/homeassistant';

        console.log(`HTTP request: ${path}`);

        if (path !== '/' && !homeassistant) {
            res.writeHead(404);
            res.end();
            return;
        }

        if (!usage) {
            res.writeHead(503);
            res.end();
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });

        if (homeassistant) {
            const [current] = usage.usageMonths.slice(-1);
            const data = {
                total_usage: current.totalUsage,
                allowable_usage: current.allowableUsage,
                home_usage: current.homeUsage,
                wifi_usage: current.wifiUsage,
                courtesy_used: usage.courtesyUsed,
                courtesy_remaining: usage.courtesyRemaining,
                courtesy_allowed: usage.courtesyAllowed,
                in_paid_overage: usage.inPaidOverage,
                remaining_usage: current.allowableUsage - current.totalUsage,
            };
            res.write(JSON.stringify(data));
        } else {
            res.write(JSON.stringify(usage));
        }
        res.end();
    }).listen(7878);
    console.log('http server started');

    eventBus.on(DATA_UPDATED, (data: xfinityUsage) => {
        usage = data;
    });
};
