import { isEmpty as _isEmpty } from 'lodash';
import { Libs } from '../providers';
import { Notification } from '../models';
import { Constants, logger } from '../common';

export const pgCreateSubscription = async (uuid: string, user: string) => {
    try {
        await Libs.pg.query(
            'INSERT INTO subscription(ctime, uuid, user_uuid)' +
                'VALUES($1, $2, $3)',
            [+new Date(), uuid, user]
        );
    } catch (err) {
        logger.error(err);
    }
};

export const pgFetchAllSubscriptions = async (uuid: string) => {
    try {
        const query = await Libs.pg.query(
            'SELECT user_uuid FROM subscription WHERE uuid = $1',
            [uuid]
        );
        return query.rows;
    } catch (err) {
        logger.error(err);
    }
};

export const wsSendPending = async (recipient: string) => {
    try {
        const event = `${Constants.TOPICS.NOTIFICATIONS}:${Constants.EVENTS.NOTIFICATIONS.PENDING}`;
        const count = await Notification.count({
            recipient,
            read: false,
            archived: false,
        }).exec();
        await Libs.ws.sendMessageToClient(
            recipient,
            JSON.stringify({
                event,
                count,
            })
        );
    } catch (err) {
        logger.error(err);
    }
};

export const wsSendMessageToClient = (
    recipient: string,
    event: string,
    payload: any
) => {
    try {
        Libs.ws.sendMessageToClient(
            recipient,
            JSON.stringify({
                event,
                ...payload,
            })
        );
    } catch (err) {
        logger.error(err);
    }
};
export const wsSendMessageToTopic = (
    topic: string,
    event: string,
    payload: any
) => {
    try {
        Libs.ws.sendMessageToTopic(
            topic,
            JSON.stringify({
                event,
                ...payload,
            })
        );
    } catch (err) {
        logger.error(err);
    }
};

// I dont think i need to send push notifications for a topic event
// but leaving note here just a potential reminder
export const rabbitPublish = async (
    recipient: string,
    rabbitOptions: {
        exchange: string;
        exchangeType: string;
    },
    payload: any
) => {
    try {
        const reply = await Libs.redis.get(recipient);
        if (_isEmpty(reply)) {
            logger.info('User not found in cache');
            return;
        }
        Libs.rabbitmq.publish(
            rabbitOptions.exchange,
            rabbitOptions.exchangeType,
            JSON.stringify({
                token: JSON.parse(reply).token,
                ...payload,
            })
        );
    } catch (err) {
        logger.error(err);
    }
};
