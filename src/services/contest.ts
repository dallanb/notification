import { Message } from 'kafka-node';
import { RabbitMQProducer, RedisClient } from '../libs';
import { logger } from '../common';


class Contest {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        console.log(key);
        console.log(value);
        switch(key){
            case 'participant_invited':
                const {user_uuid} = typeof value === 'string' ? JSON.parse(value) : value.toString();
                RedisClient.get(user_uuid).then((reply: string) => {
                    logger.info(reply);
                    RabbitMQProducer.publish('web', 'direct', reply);
                });
                break
        }
    };
}

export default new Contest();
