import { Message } from 'kafka-node';
import { logger } from '../common';

class Sport {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
    };
}

export default new Sport();
