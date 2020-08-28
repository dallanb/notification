import { KafkaConsumer, RabbitMQProducer, RedisClient } from '../libs';
import { Services } from './index';

class Libs {
    async initKafka(): Promise<void> {
        const consumer = new KafkaConsumer(Services.listener);
        consumer.run();
    }

    async initRabbitMQ(): Promise<void> {
        RabbitMQProducer.connect();
    }

    async initRedis(): Promise<void> {
        await RedisClient.init();
    }
}

export default new Libs();
