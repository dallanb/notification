import winston from 'winston';

const prettyJson = winston.format.printf((info) => {
    if (info.message.constructor === Object) {
        info.message = JSON.stringify(info.message, null, 4);
    }
    return `${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.metadata(),
        winston.format.json()
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
