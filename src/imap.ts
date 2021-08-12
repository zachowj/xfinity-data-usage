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

    if (list.length === 0) return;

    const msgId = list[list.length - 1] + '';
    const lastMsg = await client.fetchOne(msgId, { source: true });
    const message = lastMsg?.source?.toString();
    const reg = /password:(\d+)/i;
    const result = message?.replace(/(\r\n|\n|\r)/gm, '').match(reg);

    return result?.[1];
};

export const fetchCode = async (userConfig: imapConfig): Promise<string> => {
    return new Promise((resolve, reject) => {
        const config = {
            ..._defaultConfig,
            ...userConfig,
            logger: pino,
        };
        const client = new imapflow.ImapFlow(config);
        let timeout: NodeJS.Timeout;

        client.on('exists', async (data: existsData) => {
            if (data.count > data.prevCount) {
                const code = await search(client);
                if (code) {
                    clearTimeout(timeout);
                    await client.logout();
                    resolve(code);
                }
            }
        });
        client.on('mailboxOpen', async () => {
            const code = await search(client);
            if (code) {
                await client.logout();
                resolve(code);
            }

            timeout = setTimeout(async () => {
                await client.logout();
                reject(new Error('No code found before 5 minute timeout occurred.'));
            }, 300000);
        });
        client
            .connect()
            .then(() => {
                client.mailboxOpen('INBOX');
            })
            .catch((e) => {
                client.logout();
                reject(new Error(`Error was thrown while attempting to connect to imap: ${e}`));
            });
    });
};
