import { Message } from 'kafka-node';
import { Notification } from '../models';
import { Constants, logger } from '../common';
import locale from '../locale';
import { wsSendMessageToTopic } from './utils';
import { pick as _pick } from 'lodash';

class Score {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const data =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        // notification will be created but not saved
        const notification = new Notification({
            key,
            topic: Constants.TOPICS.SCORES,
        });
        switch (key) {
            case Constants.EVENTS.SCORES.STROKE_UPDATE: {
                notification.sender = null;
                notification.recipient = null;
                notification.message = locale.EVENTS.SCORES;
                notification.properties = {
                    contest_uuid: data.contest_uuid,
                    sheet_uuid: data.sheet_uuid,
                    strokes: data.strokes,
                };
                const event = `${notification.topic}:${notification.key}`;
                const payload = {
                    ..._pick(notification, ['message', 'sender']),
                    ..._pick(notification.properties, [
                        'contest_uuid',
                        'sheet_uuid',
                        'strokes',
                    ]),
                };
                wsSendMessageToTopic(data.contest_uuid, event, payload);
                break;
            }
        }
    };
}

export default new Score();
