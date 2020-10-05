import { Libs } from '../providers';
import { Notification } from '../models';
import { Constants, logger } from '../common';

export const wsSendPending = async (recipient: string) => {
    try {
        const event = `${Constants.TOPICS.NOTIFICATIONS}:${Constants.EVENTS.NOTIFICATIONS.PENDING}`;
        const count = await Notification.count({
            recipient,
            read: false,
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

export const wsSendMessage = (
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
