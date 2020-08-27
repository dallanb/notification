import { Consumer, Producer } from '../libs';
import { Services } from './index';

class Libs {
    async initKafka(): Promise<void> {
        const consumer = new Consumer(Services.listener);
        consumer.run();
    }

    async initRabbitMQ(): Promise<void> {
        Producer.connect();
    }
}

export default new Libs();
