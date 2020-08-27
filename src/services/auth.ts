import { Message } from 'kafka-node';
import { Producer } from '../libs';

class Auth {
    handleEvent(key: Message['key'], value: Message['value']): void {
        console.log(key);
        console.log(value);
        Producer.publish('web', 'direct', value);
    }
}

export default new Auth();
