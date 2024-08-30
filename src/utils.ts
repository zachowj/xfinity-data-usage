export function isError(e: unknown): e is Error {
    return e instanceof Error;
}

export function isAccessDenied(e: unknown): e is Error {
    return isError(e) && e.message === 'Access Denied';
}
