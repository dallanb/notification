import { v4 as uuid_v4 } from 'uuid';
import winston from 'winston';

export const generateUUID = () => uuid_v4();

export const prettyJson = winston.format.printf(info => {
    if (info.message.constructor === Object) {
        info.message = JSON.stringify(info.message, null, 4);
    }
    return `${info.level}: ${[info.metadata.timestamp]}: ${info.message}`;
});
