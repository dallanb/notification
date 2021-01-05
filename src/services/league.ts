import { Message } from 'kafka-node';
import { logger } from '../common';

class League {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
    };
}

export default new League();
