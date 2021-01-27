import { Message } from 'kafka-node';
import { Constants, logger } from '../common';
import { Notification } from '../models';

class Member {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
    };
}

export default new Member();
