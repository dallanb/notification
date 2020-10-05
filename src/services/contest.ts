import { Message } from 'kafka-node';
import { logger } from '../common';
import { Notification } from '../models';
import { Libs } from '../providers';

class Contest {
    handleEvent = async (key: Message['key'], value: Message['value']) => {
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
                notification.properties = { contest_uuid, participant_uuid };
                notification.save();
                // WS
                Libs.ws.sendMessageToClient(
                    user_uuid,
                    JSON.stringify({
                        event: 'contest:participant_invited',
                        message: notification.message,
                        sender: notification.sender,
                        contest_uuid: notification.properties.contest_uuid,
                        participant_uuid:
                            notification.properties.participant_uuid,
                    })
                );
                // send a total of pending
                Libs.ws.sendMessageToClient(
                    user_uuid,
                    JSON.stringify({
                        event: 'notification:pending',
                        count: await Notification.count({
                            recipient: user_uuid,
                        }).exec(),
                    })
                );
                Libs.redis.get(user_uuid).then((reply: string) => {
                    // Rabbit
                    Libs.rabbitmq.publish(
                        'web',
                        'direct',
                        JSON.stringify({
                            token: JSON.parse(reply).token,
                            message: notification.message,
                            sender: notification.sender,
                            contest_uuid: notification.properties.contest_uuid,
                            participant_uuid:
                                notification.properties.participant_uuid,
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
                notification.properties = { contest_uuid, participant_uuid };
                notification.save();
                // WS
                Libs.ws.sendMessageToClient(
                    owner_uuid,
                    JSON.stringify({
                        event: 'notification:participant_invited',
                        message: notification.message,
                        sender: notification.sender,
                        contest_uuid: notification.properties.contest_uuid,
                        participant_uuid:
                            notification.properties.participant_uuid,
                    })
                );
                Libs.redis.get(owner_uuid).then((reply: string) => {
                    logger.info(reply);
                    // Rabbit
                    Libs.rabbitmq.publish(
                        'web',
                        'direct',
                        JSON.stringify({
                            token: JSON.parse(reply).token,
                            message: notification.message,
                            sender: notification.sender,
                            contest_uuid: notification.properties.contest_uuid,
                            participant_uuid:
                                notification.properties.participant_uuid,
                        })
                    );
                });
                break;
        }
    };
}

export default new Contest();
