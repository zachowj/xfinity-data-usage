import UserAgent from 'user-agents';

export interface userAgent {
    userAgent: string;
    width: number;
    height: number;
}

export const generateUserAgent = (): userAgent => {
    const filter = [/Chrome/, { platform: 'Linux x86_64' }];
    const agent = new UserAgent(filter);
    return {
        userAgent: agent.data.userAgent,
        width: agent.data.viewportWidth,
        height: agent.data.viewportHeight,
    };
};
