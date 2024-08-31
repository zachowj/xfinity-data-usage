import UserAgent from 'user-agents';

export function isError(e: unknown): e is Error {
    return e instanceof Error;
}

export function isAccessDenied(e: unknown): e is Error {
    return isError(e) && e.message === 'Access Denied';
}

export function getUserAgent() {
    const userAgent = new UserAgent((data) => {
        const version = data.userAgent.match(/Firefox\/(\d+\.\d+)/);
        if (!version) {
            return false;
        }

        if (parseFloat(version[1]) < 115) {
            return false;
        }

        return true;
    });

    return userAgent;
}
