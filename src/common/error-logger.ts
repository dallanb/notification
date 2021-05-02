import winston from 'winston';
import expressWinston from 'express-winston';
import { prettyJson } from './utils';
import logger from './logger';

const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
});

export default errorLogger;
