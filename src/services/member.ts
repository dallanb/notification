import { Message } from 'kafka-node';
import { pick as _pick } from 'lodash';
import { Constants, logger } from '../common';
import { Notification } from '../models';
import locale from '../locale';
import {
    pgCreateSubscription,
    rabbitPublish,
    wsSendMessageToClient,
    wsSendPending,
} from './utils';

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
            case Constants.EVENTS.MEMBERS.MEMBER_INVITED: {
                await pgCreateSubscription(data.league_uuid, data.user_uuid);

                notification.recipient = data.user_uuid;
                notification.sender = data.league_owner_uuid;
                notification.properties = {
                    member_uuid: data.uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.MEMBERS.MEMBER_INVITED;
                await notification.save();
                // WS
                wsSendMessageToClient(
                    notification.recipient,
                    `${notification.topic}:${notification.key}`,
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'member_uuid',
                            'league_uuid',
                        ]),
                    }
                );
                // send a total of pending
                wsSendPending(notification.recipient);
                rabbitPublish(
                    notification.recipient,
                    { exchange: 'web', exchangeType: 'direct' },
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'member_uuid',
                            'league_uuid',
                        ]),
                    }
                );
                break;
            }
            case Constants.EVENTS.MEMBERS.MEMBER_ACTIVE: {
                notification.recipient = data.league_owner_uuid;
                notification.sender = data.user_uuid;
                notification.properties = {
                    member_uuid: data.uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.MEMBERS.MEMBER_ACTIVE;
                await notification.save();

                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'member_uuid',
                        'league_uuid',
                    ]),
                };
                // WS
                wsSendMessageToClient(notification.recipient, event, payload);
                // send a total of pending
                wsSendPending(notification.recipient);
                rabbitPublish(
                    notification.recipient,
                    { exchange: 'web', exchangeType: 'direct' },
                    payload
                );
                break;
            }
        }
    };
}

export default new Member();
