import imapflow from 'imapflow';
import Pino from 'pino';

export interface imapConfig {
    host: string;
    port: number;
    secure?: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

interface existsData {
    path: string;
    count: number;
    prevCount: number;
}

const pino = Pino();
pino.level = 'silent';

const _defaultConfig: Partial<imapConfig> = {
    port: 993,
    secure: true,
};

const search = async (client: imapflow.ImapFlow): Promise<string | null | undefined> => {
    const list = await client.search({
        seen: false,
        and: [
            { from: 'online.communications@alerts.comcast.net' },
            { subject: 'Use this code to reset your password' },
        ],
    });

    if (list.length === 0) return null;

    const msgId = list[list.length - 1] + '';
    const lastMsg = await client.fetchOne(msgId, { source: true });
    const message = lastMsg?.source?.toString();
    const reg = /password\:(\d+)/i;
    const result = message?.replace(/(\r\n|\n|\r)/gm, '').match(reg);

    return result && result[1];
};

export const fetchCode = async (userConfig: imapConfig): Promise<string> => {
    const config = {
        ..._defaultConfig,
        ...userConfig,
        logger: pino,
    };

    const client = new imapflow.ImapFlow(config);
    return new Promise(async (res, rej) => {
        await client.connect();
        await client.mailboxOpen('INBOX');
        client.on('exists', async (data: existsData) => {
            if (data.count > data.prevCount) {
                const code = await search(client);
                if (code) {
                    await client.logout();
                    res(code);
                }
            }
        });
        const code = await search(client);
        if (code) {
            await client.logout();
            res(code);
        }

        setTimeout(async () => {
            await client.logout();
            rej('No code found before 30 second timeout occurred');
        }, 300000);
    });
};
