import logger from 'winston';

logger.addColors({
    debug: 'green',
    info: 'cyan',
    silly: 'magenta',
    warn: 'yellow',
    error: 'red',
});

export default logger;
