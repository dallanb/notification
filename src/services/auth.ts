import { Message } from 'kafka-node';
import producer from '../libs/rabbitmq/producer';

class Auth {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        console.log(key);
        console.log(value);
    };
}

export default new Auth();
