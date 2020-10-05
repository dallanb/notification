import { Message } from 'kafka-node';
import { pick as _pick } from 'lodash';
import { Constants, logger } from '../common';
import { Notification } from '../models';
import locale from '../locale';
import { rabbitPublish, wsSendMessage, wsSendPending } from './utils';

class Contest {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const { user_uuid, owner_uuid, contest_uuid, participant_uuid } =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification = new Notification({
            key,
            topic: Constants.TOPICS.CONTESTS,
            properties: { contest_uuid, participant_uuid },
        });
        switch (key) {
            case Constants.EVENTS.CONTESTS.PARTICIPANT_INVITED:
                notification.recipient = user_uuid;
                notification.sender = owner_uuid;
                notification.message =
                    locale.EVENTS.CONTESTS.PARTICIPANT_INVITED;
                await notification.save();
                // WS
                wsSendMessage(
                    user_uuid,
                    `${notification.topic}:${notification.key}`,
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'contest_uuid',
                            'participant_uuid',
                        ]),
                    }
                );
                // send a total of pending
                wsSendPending(user_uuid);
                rabbitPublish(
                    notification.recipient,
                    { exchange: 'web', exchangeType: 'direct' },
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'contest_uuid',
                            'participant_uuid',
                        ]),
                    }
                );
                break;
            case Constants.EVENTS.CONTESTS.PARTICIPANT_ACTIVE:
                notification.recipient = owner_uuid;
                notification.sender = user_uuid;
                notification.message =
                    locale.EVENTS.CONTESTS.PARTICIPANT_ACTIVE;
                notification.save();
                // WS
                wsSendMessage(
                    owner_uuid,
                    `${notification.topic}:${notification.key}`,
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'contest_uuid',
                            'participant_uuid',
                        ]),
                    }
                );
                // send a total of pending
                wsSendPending(owner_uuid);
                rabbitPublish(
                    notification.recipient,
                    { exchange: 'web', exchangeType: 'direct' },
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'contest_uuid',
                            'participant_uuid',
                        ]),
                    }
                );
                break;
        }
    };
}

export default new Contest();
