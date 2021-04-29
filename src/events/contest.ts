import { Message } from 'kafka-node';
import { pick as _pick } from 'lodash';
import { Constants, logger } from '../common';
import { Notification } from '../models';
import locale from '../locale';
import {
    pgCreateSubscription,
    pgDeleteSubscription,
    pgFetchAllSubscriptions,
    rabbitPublish,
    wsSendMessageToClient,
    wsSendMessageToTopic,
    wsSendPending,
} from './utils';

class Contest {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification: any = {
            key,
            topic: Constants.TOPICS.CONTESTS,
        };
        switch (key) {
            case Constants.EVENTS.CONTESTS.AVATAR_CREATED:
            case Constants.EVENTS.CONTESTS.AVATAR_UPDATED:
            case Constants.EVENTS.CONTESTS.AVATAR_DELETED: {
                const event = `${notification.topic}:${notification.key}`;
                wsSendMessageToTopic(data.contest_uuid, event, data);
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_CREATED: {
                await pgCreateSubscription(data.uuid, data.owner_uuid);
                // no notification needed
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_READY: {
                notification.sender = data.owner_uuid;
                notification.properties = {
                    contest_uuid: data.uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.CONTEST_READY;
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'league_uuid',
                    ]),
                };
                wsSendMessageToTopic(data.uuid, event, payload);

                const rows = await pgFetchAllSubscriptions(data.uuid);
                for (const row of rows) {
                    notification.recipient = row.user_uuid;

                    await Notification.create(notification);

                    // WS
                    wsSendMessageToClient(
                        notification.recipient,
                        event,
                        payload
                    );
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        payload
                    );
                }
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_INACTIVE: {
                notification.sender = null;
                notification.properties = {
                    contest_uuid: data.uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.CONTEST_INACTIVE;
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'league_uuid',
                    ]),
                };
                wsSendMessageToTopic(data.uuid, event, payload);

                const rows = await pgFetchAllSubscriptions(data.uuid);
                for (const row of rows) {
                    notification.recipient = row.user_uuid;

                    await Notification.create(notification);
                    // WS
                    wsSendMessageToClient(
                        notification.recipient,
                        event,
                        payload
                    );
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        payload
                    );
                }
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_ACTIVE: {
                notification.sender = null;
                notification.properties = {
                    contest_uuid: data.uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.CONTEST_ACTIVE;
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'league_uuid',
                    ]),
                };
                wsSendMessageToTopic(data.uuid, event, payload);

                const rows = await pgFetchAllSubscriptions(data.uuid);
                for (const row of rows) {
                    notification.recipient = row.user_uuid;

                    await Notification.create(notification);
                    // WS
                    wsSendMessageToClient(
                        notification.recipient,
                        event,
                        payload
                    );
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        payload
                    );
                }
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_COMPLETED: {
                notification.sender = null;
                notification.properties = {
                    contest_uuid: data.uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.CONTEST_COMPLETED;
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'league_uuid',
                    ]),
                };
                wsSendMessageToTopic(data.uuid, event, payload);

                const rows = await pgFetchAllSubscriptions(data.uuid);
                for (const row of rows) {
                    notification.recipient = row.user_uuid;

                    await Notification.create(notification);
                    // WS
                    wsSendMessageToClient(
                        notification.recipient,
                        event,
                        payload
                    );
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        payload
                    );
                }
                break;
            }
            case Constants.EVENTS.CONTESTS.PARTICIPANT_INVITED: {
                await pgCreateSubscription(data.contest_uuid, data.user_uuid);

                notification.recipient = data.user_uuid;
                notification.sender = data.owner_uuid;
                notification.properties = {
                    contest_uuid: data.contest_uuid,
                    participant_uuid: data.participant_uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.PARTICIPANT_INVITED;
                await Notification.create(notification);
                // WS
                wsSendMessageToClient(
                    notification.recipient,
                    `${notification.topic}:${notification.key}`,
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, [
                            'contest_uuid',
                            'participant_uuid',
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
                            'contest_uuid',
                            'participant_uuid',
                            'league_uuid',
                        ]),
                    }
                );
                break;
            }
            case Constants.EVENTS.CONTESTS.PARTICIPANT_INACTIVE: {
                await pgDeleteSubscription(data.contest_uuid, data.user_uuid);

                notification.recipient = data.owner_uuid;
                notification.sender = data.user_uuid;
                notification.properties = {
                    contest_uuid: data.contest_uuid,
                    participant_uuid: data.participant_uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.PARTICIPANT_INACTIVE;
                await Notification.create(notification);

                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'participant_uuid',
                        'league_uuid',
                    ]),
                };
                // WS
                wsSendMessageToTopic(data.contest_uuid, event, payload);
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
            case Constants.EVENTS.CONTESTS.PARTICIPANT_ACTIVE: {
                notification.recipient = data.owner_uuid;
                notification.sender = data.user_uuid;
                notification.properties = {
                    contest_uuid: data.contest_uuid,
                    participant_uuid: data.participant_uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.CONTESTS.PARTICIPANT_ACTIVE;
                await Notification.create(notification);

                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'participant_uuid',
                        'league_uuid',
                    ]),
                };
                // WS
                wsSendMessageToTopic(data.contest_uuid, event, payload);
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
            case Constants.EVENTS.CONTESTS.PARTICIPANT_COMPLETED: {
                notification.recipient = data.owner_uuid;
                notification.sender = data.user_uuid;
                notification.properties = {
                    contest_uuid: data.contest_uuid,
                    participant_uuid: data.participant_uuid,
                    league_uuid: data.league_uuid,
                };
                notification.message =
                    data.message ||
                    locale.EVENTS.CONTESTS.PARTICIPANT_COMPLETED;

                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'participant_uuid',
                        'league_uuid',
                    ]),
                };
                // WS
                wsSendMessageToTopic(data.contest_uuid, event, payload);
                wsSendMessageToClient(notification.recipient, event, payload);

                if (notification.recipient !== notification.sender) {
                    await Notification.create(notification);
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        payload
                    );
                }

                break;
            }
            case Constants.EVENTS.CONTESTS.NAME_UPDATED: {
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    league_uuid: data.league_uuid,
                    contest_uuid: data.uuid,
                    name: data.name,
                };
                wsSendMessageToTopic(data.uuid, event, payload);
                break;
            }
            case Constants.EVENTS.CONTESTS.START_TIME_UPDATED: {
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    league_uuid: data.league_uuid,
                    contest_uuid: data.uuid,
                    start_time: data.start_time,
                };
                wsSendMessageToTopic(data.uuid, event, payload);
                break;
            }
        }
    };
}

export default new Contest();
