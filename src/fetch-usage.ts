import { exit } from 'process';

import { Xfinity } from './xfinity.js';

process.on('message', async (msg) => {
    if (msg.type === 'start') {
        try {
            const xfinity = new Xfinity(msg.xfinityConfig, msg.imapConfig);
            const data = await xfinity.fetch();
            send({ type: 'usage', usage: data });
        } catch (e) {
            send({ type: 'error', message: e.message });
        } finally {
            exit();
        }
    }
});

send({ type: 'loaded' });

function send(data: Record<string, unknown>) {
    typeof process.send === 'function' && process.send(data);
}
