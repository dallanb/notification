import { Message } from 'kafka-node';
import { RabbitMQProducer, RedisClient } from '../libs';

class Auth {
    handleEvent(key: Message['key'], value: Message['value']): void {
        console.log(key);
        console.log(value);
        const { username, device_id } =
            typeof value === 'string' ? JSON.parse(value) : value.toString();
        switch (key) {
            case 'user_login':
                RedisClient.set(username, JSON.stringify({ device_id }));
                break;
            case 'user_ping':
                RedisClient.get(username).then((reply: string) =>
                    RabbitMQProducer.publish('web', 'direct', reply)
                );
                break;
        }
    }
}

export default new Auth();
