import winston from 'winston';
import { prettyJson } from './utils';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata(),
        winston.format.json(),
        prettyJson
    ),
    transports: [new winston.transports.File({ filename: 'logfile.log' })],
});

winston.addColors({
    debug: 'green',
    info: 'cyan',
    silly: 'magenta',
    warn: 'yellow',
    error: 'red',
});

if (process.env.ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.splat(),
                winston.format.prettyPrint(),
                prettyJson
            ),
        })
    );
}

export default logger;
