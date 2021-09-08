import Winston from 'winston';

const { createLogger, format, transports } = Winston;
const { combine, splat, timestamp, printf, colorize } = format;

const LOGGING_LEVEL = process.env.LOGGING_LEVEL ?? 'info';

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] : ${message}`;
});

const logger = createLogger({
    level: LOGGING_LEVEL,
    format: combine(colorize(), splat(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
    transports: [new transports.Console()],
});

export default logger;
