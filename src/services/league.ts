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
            case Constants.EVENTS.LEAGUES.MEMBER_PENDING: {
                await pgCreateSubscription(data.league_uuid, data.user_uuid);

                notification.recipient = data.user_uuid;
                notification.sender = data.owner_uuid;
                notification.properties = {
                    member_uuid: data.uuid, // TODO: THIS IS PROBABLY AN ISSUE HERE!
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.LEAGUES.MEMBER_PENDING;
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
            case Constants.EVENTS.LEAGUES.MEMBER_ACTIVE: {
                notification.recipient = data.owner_uuid;
                notification.sender = data.user_uuid;
                notification.properties = {
                    member_uuid: data.uuid, // TODO: this is not present (maybe make this league_member_uuid)
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.LEAGUES.MEMBER_ACTIVE;
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

export default new League();
