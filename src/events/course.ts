import { Message } from 'kafka-node';
import { Constants, logger } from '../common';
import locale from '../locale/en-CA';
import { pick as _pick } from 'lodash';
import { rabbitPublish, wsSendMessageToClient, wsSendPending } from './utils';
import { Notification } from '../models';

class Course {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification = new Notification({
            key,
            topic: Constants.TOPICS.COURSES,
        });
        switch (key) {
            case Constants.EVENTS.COURSES.COURSE_APPROVED: {
                notification.sender = null;
                notification.recipient = data.created_by;
                notification.properties = {
                    course_uuid: data.uuid,
                };
                notification.message =
                    data.message || locale.EVENTS.COURSES.COURSE_APPROVED;
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, ['course_uuid']),
                };
                await notification.save();

                wsSendMessageToClient(notification.recipient, event, payload);
                // send a total of pending
                wsSendPending(notification.recipient);
                rabbitPublish(
                    notification.recipient,
                    { exchange: 'web', exchangeType: 'direct' },
                    {
                        ..._pick(notification, ['message', 'sender']),
                        ..._pick(notification.properties, ['course_uuid']),
                    }
                );
                break;
            }
        }
    };
}

export default new Course();
