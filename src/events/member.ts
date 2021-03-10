import { Message } from 'kafka-node';
import { Constants, logger } from '../common';
import { Notification } from '../models';
import { wsSendMessageToClient } from './utils';

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
            case Constants.EVENTS.MEMBERS.AVATAR_CREATED:
            case Constants.EVENTS.MEMBERS.AVATAR_UPDATED:
            case Constants.EVENTS.MEMBERS.AVATAR_DELETED: {
                wsSendMessageToClient(
                    data.user_uuid,
                    `${notification.topic}:${notification.key}`,
                    data
                );
                break;
            }
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
