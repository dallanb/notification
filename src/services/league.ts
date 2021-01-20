import { Message } from 'kafka-node';
import { Constants, logger } from '../common';
import {
    pgCreateSubscription,
    pgFetchAllSubscriptions,
    rabbitPublish,
    wsSendMessageToClient,
    wsSendMessageToTopic,
    wsSendPending,
} from './utils';
import locale from '../locale/en-CA';
import { pick as _pick } from 'lodash';
import { Notification } from '../models';

class League {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification = new Notification({
            key,
            topic: Constants.TOPICS.LEAGUES,
        });
        switch (key) {
            case Constants.EVENTS.LEAGUES.LEAGUE_CREATED: {
                await pgCreateSubscription(data.uuid, data.owner_uuid);
                // no notification needed
                break;
            }
        }
    };
}

export default new League();
