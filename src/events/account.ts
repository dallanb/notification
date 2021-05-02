import { Message } from 'kafka-node';
import { logger } from '../common';

class Account {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
    };
}

export default new Account();
