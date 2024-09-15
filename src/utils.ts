import UserAgent from 'user-agents';

export function isError(e: unknown): e is Error {
    return e instanceof Error;
}

export function isAccessDenied(e: unknown): e is Error {
    return isError(e) && e.message === 'Access Denied';
}

export function getUserAgent() {
    const userAgent = new UserAgent((data) => {
        const { deviceCategory, platform, userAgent } = data;
        if (deviceCategory !== 'desktop' || !/Firefox/i.test(userAgent) || /linux/i.test(platform)) {
            return false;
        }

        return true;
    });

    return userAgent;
}

export function nextAtString(offset: number): string {
    return new Date(Date.now() + offset).toLocaleTimeString();
}

export function getTimeout(intervalMs: number, iteration: number): number {
    const TWENTY_FOUR_HOURS = 8.64e7;
    const THREE_HOURS = 1.08e7;
    const minInterval = Math.max(Math.pow(2, iteration) * intervalMs, THREE_HOURS);
    const timeout = Math.min(minInterval, TWENTY_FOUR_HOURS);
    return timeout;
}
