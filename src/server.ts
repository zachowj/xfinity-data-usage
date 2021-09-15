import Http from 'http';

import { currentUsage as usage } from './app.js';
import logger from './logger.js';

export const createServer = (): void => {
    Http.createServer((req, res) => {
        const homeassistant = req.url === '/homeassistant';

        logger.debug(`HTTP request: ${req.url}`);

        if (req.url !== '/' && !homeassistant) {
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
    logger.info('http server started');
};
