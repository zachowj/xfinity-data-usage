import { exit } from 'process';

import { imapConfig } from './imap.js';
import { Xfinity, xfinityConfig } from './xfinity.js';

type processMessage = {
    type: string;
    xfinityConfig: xfinityConfig;
    imapConfig: imapConfig;
};

process.on('message', async (msg: processMessage) => {
    const type = msg.type;
    if (type === 'start') {
        try {
            const xfinity = new Xfinity(msg.xfinityConfig as xfinityConfig, msg.imapConfig as imapConfig);
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
