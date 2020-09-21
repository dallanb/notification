import { Message } from 'kafka-node';
import { RabbitMQProducer, RedisClient } from '../libs';
import { logger } from '../common';
import { Notification } from '../models';

class Contest {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        logger.info(key);
        logger.info(value);
        switch (key) {
            case 'participant_invited':
                const { user_uuid, owner_uuid } =
                    typeof value === 'string'
                        ? JSON.parse(value)
                        : value.toString();
                Notification.create({
                    topic: 'contests',
                    key,
                    recipient: user_uuid,
                    sender: owner_uuid,
                    message: 'Contest Invite!',
                });
                RedisClient.get(user_uuid).then((reply: string) => {
                    logger.info(reply);
                    RabbitMQProducer.publish('web', 'direct', reply);
                });
                break;
        }
    };
}

export default new Contest();
