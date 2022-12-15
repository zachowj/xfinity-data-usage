import { XfinityUsage, XfinityUsageError } from './xfinity';

export function isXfinityUsageError(data: XfinityUsage | XfinityUsageError): data is XfinityUsageError {
    return (data as XfinityUsageError).code !== undefined;
}
