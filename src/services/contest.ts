import { Message } from 'kafka-node';
import { RabbitMQProducer, RedisClient } from '../libs';
import { logger } from '../common';
import { Notification } from '../models';

class Contest {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        const { user_uuid, owner_uuid, contest_uuid, participant_uuid } =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        const notification = new Notification({});
        switch (key) {
            case 'participant_invited':
                notification.topic = 'contests';
                notification.key = key;
                notification.recipient = user_uuid;
                notification.sender = owner_uuid;
                notification.message = 'Contest Invite!';
                notification.properties = {contest_uuid, participant_uuid};
                notification.save();
                RedisClient.get(user_uuid).then((reply: string) => {
                    RabbitMQProducer.publish(
                        'web',
                        'direct',
                        JSON.stringify({
                            token: JSON.parse(reply).token,
                            message: notification.message,
                            sender: notification.sender,
                            contest_uuid: notification.properties.contest_uuid,
                            participant_uuid: notification.properties.participant_uuid
                        })
                    );
                });
                break;
            case 'participant_active':
                notification.topic = 'contests';
                notification.key = key;
                notification.recipient = owner_uuid;
                notification.sender = user_uuid;
                notification.message = 'Contest Accepted!';
                notification.properties = {contest_uuid, participant_uuid};
                notification.save();
                RedisClient.get(owner_uuid).then((reply: string) => {
                    logger.info(reply);
                    RabbitMQProducer.publish(
                        'web',
                        'direct',
                        JSON.stringify({
                            token: JSON.parse(reply).token,
                            message: notification.message,
                            sender: notification.sender,
                            contest_uuid: notification.properties.contest_uuid,
                            participant_uuid: notification.properties.participant_uuid
                        })
                    );
                });
                break;
        }
    };
}

export default new Contest();
