import { Message } from 'kafka-node';
import { pick as _pick } from 'lodash';
import { Constants, logger } from '../common';
import { Notification } from '../models';
import {
    pgCreateSubscription,
    rabbitPublish,
    wsSendMessageToClient,
    wsSendPending,
} from './utils';
import locale from '../locale/en-CA';

class Member {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification = new Notification({
            key,
            topic: Constants.TOPICS.MEMBERS,
        });
        switch (key) {
            case Constants.EVENTS.MEMBERS.MEMBER_PENDING: {
                break;
            }
            case Constants.EVENTS.MEMBERS.MEMBER_ACTIVE: {
                break;
            }
            case Constants.EVENTS.MEMBERS.DISPLAY_NAME_UPDATED: {
                wsSendMessageToClient(
                    data.user_uuid,
                    `${notification.topic}:${notification.key}`,
                    data
                );
                break;
            }
            case Constants.EVENTS.MEMBERS.COUNTRY_UPDATED: {
                wsSendMessageToClient(
                    data.user_uuid,
                    `${notification.topic}:${notification.key}`,
                    data
                );
                break;
            }
        }
    };
}

export default new Member();
