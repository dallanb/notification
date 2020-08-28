import { Message } from 'kafka-node';
import { RabbitMQProducer } from '../libs';

class Auth {
    handleEvent(key: Message['key'], value: Message['value']): void {
        console.log(key);
        console.log(value);
        RabbitMQProducer.publish('web', 'direct', value);
    }
}

export default new Auth();
