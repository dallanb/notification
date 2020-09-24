import { Message } from 'kafka-node';
import { logger } from '../common';

class Auth {
    handleEvent(key: Message['key'], value: Message['value']): void {
        logger.info(key);
        logger.info(value);
    }
}

export default new Auth();
