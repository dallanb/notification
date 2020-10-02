import {
    KafkaConsumer,
    MongoDB,
    RabbitMQProducer,
    RedisClient,
    WSServer,
} from '../libs';
import { Services } from './index';
import { logger } from '../common';
import { Server } from 'http';

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

    async initMongo(): Promise<void> {
        await MongoDB.connect();
    }

    async initWS(httpServer: Server): Promise<void> {
        new WSServer(httpServer, (data) => logger.info(data)).init();
    }
}

export default new Libs();
