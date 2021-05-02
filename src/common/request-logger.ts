import winston from 'winston';
import expressWinston from 'express-winston';
import { prettyJson } from './utils';
import logger from './logger';

const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: (req, res: any) =>
        `${res.statusCode} - ${req.method} ${req.url} - body ${JSON.stringify(
            req.body
        )} - ${res.responseTime}ms`, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).,
    ignoredRoutes: ['/ping'],
    ignoreRoute: (req, res) => {
        return false;
    }, // optional: allows to skip some log messages based on request and/or response
});

export default requestLogger;
