import { Message } from 'kafka-node';
import { Constants, logger } from '../common';
import { wsSendMessageToTopic } from './utils';

class Wager {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification: any = {
            key,
            topic: Constants.TOPICS.WAGERS,
        };
        switch (key) {
            case Constants.EVENTS.WAGERS.PAYOUT_UPDATED: {
                wsSendMessageToTopic(
                    data.contest_uuid,
                    `${notification.topic}:${notification.key}`,
                    data
                );
                break;
            }
        }
    };
}

export default new Wager();
