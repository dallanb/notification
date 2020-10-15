import { Message } from 'kafka-node';
import { pick as _pick } from 'lodash';
import { Constants, logger } from '../common';
import { Notification } from '../models';
import locale from '../locale';
import {
    pgCreateSubscription,
    pgFetchAllSubscriptions,
    rabbitPublish,
    wsSendMessage,
    wsSendPending,
} from './utils';

class Contest {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification = new Notification({
            key,
            topic: Constants.TOPICS.CONTESTS,
        });
        switch (key) {
            case Constants.EVENTS.CONTESTS.CONTEST_CREATED: {
                await pgCreateSubscription(data.uuid, data.owner_uuid);
                // no notification needed
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_READY: {
                const rows = await pgFetchAllSubscriptions(data.uuid);
                for (const row of rows) {
                    if (row.user_uuid === data.owner_uuid) continue;

                    notification.recipient = row.user_uuid;
                    notification.sender = data.owner_uuid;
                    notification.properties = {
                        contest_uuid: data.uuid,
                    };
                    notification.message = locale.EVENTS.CONTESTS.CONTEST_READY;

                    await notification.save();
                    // WS
                    wsSendMessage(
                        notification.recipient,
                        `${notification.topic}:${notification.key}`,
                        {
                            ..._pick(notification, ['message', 'sender']),
                            ..._pick(notification.properties, ['contest_uuid']),
                        }
                    );
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        {
                            ..._pick(notification, ['message', 'sender']),
                            ..._pick(notification.properties, ['contest_uuid']),
                        }
                    );
                }
                break;
            }
            case Constants.EVENTS.CONTESTS.CONTEST_TIMEOUT: {
                const rows = await pgFetchAllSubscriptions(data.uuid);
                for (const row of rows) {
                    notification.recipient = row.user_uuid;
                    notification.sender = null;
                    notification.properties = {
                        contest_uuid: data.uuid,
                    };
                    notification.message =
                        locale.EVENTS.CONTESTS.CONTEST_TIMEOUT;

                    await notification.save();
                    // WS
                    wsSendMessage(
                        notification.recipient,
                        `${notification.topic}:${notification.key}`,
                        {
                            ..._pick(notification, ['message', 'sender']),
                            ..._pick(notification.properties, ['contest_uuid']),
                        }
                    );
                    // send a total of pending
                    wsSendPending(notification.recipient);
                    rabbitPublish(
                        notification.recipient,
                        { exchange: 'web', exchangeType: 'direct' },
                        {
                            ..._pick(notification, ['message', 'sender']),
                            ..._pick(notification.properties, ['contest_uuid']),
                        }
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
                };
                notification.message =
                    locale.EVENTS.CONTESTS.PARTICIPANT_INVITED;
                await notification.save();
                // WS
                wsSendMessage(
                    notification.recipient,
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
                wsSendPending(notification.recipient);
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
            case Constants.EVENTS.CONTESTS.PARTICIPANT_ACTIVE: {
                notification.recipient = data.owner_uuid;
                notification.sender = data.user_uuid;
                notification.properties = {
                    contest_uuid: data.contest_uuid,
                    participant_uuid: data.participant_uuid,
                };
                notification.message =
                    locale.EVENTS.CONTESTS.PARTICIPANT_ACTIVE;
                await notification.save();
                // WS
                wsSendMessage(
                    notification.recipient,
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
                wsSendPending(notification.recipient);
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
        }
    };
}

export default new Contest();
