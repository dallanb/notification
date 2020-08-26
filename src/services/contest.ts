import { Message } from 'kafka-node';

class Contest {
    handleEvent = (key: Message['key'], value: Message['value']) => {
        console.log(key);
        console.log(value);
    };
}

export default new Contest();
