import {
    KafkaConsumer,
    MongoDB,
    RabbitMQProducer,
    RedisClient,
    WSServer,
} from '../libs';
import { logger } from '../common';
import { Server } from 'http';
import { Message } from 'kafka-node';
import { Account, Auth, Contest, Score, Sport, Wager } from '../services';

class Libs {
    mongo: any;
    kafka: any;
    redis: any;
    rabbitmq: any;
    ws: any;

    constructor() {
        this.mongo = undefined;
        this.kafka = undefined;
        this.redis = undefined;
        this.rabbitmq = undefined;
        this.ws = undefined;
    }

    async initKafka(): Promise<void> {
        this.kafka = new KafkaConsumer(({ topic, key, value }: Message) => {
            switch (topic) {
                case 'auth':
                    Auth.handleEvent(key, value);
                    break;
                case 'accounts':
                    Account.handleEvent(key, value);
                    break;
                case 'contests':
                    Contest.handleEvent(key, value);
                    break;
                case 'scores':
                    Score.handleEvent(key, value);
                    break;
                case 'sports':
                    Sport.handleEvent(key, value);
                    break;
                case 'wagers':
                    Wager.handleEvent(key, value);
                    break;
                default:
                    throw new Error('Invalid topic');
            }
        });
        this.kafka.run();
    }

    async initRabbitMQ(): Promise<void> {
        this.rabbitmq = RabbitMQProducer;
        this.rabbitmq.connect();
    }

    async initRedis(): Promise<void> {
        this.redis = RedisClient;
        await this.redis.init();
    }

    async initMongo(): Promise<void> {
        this.mongo = MongoDB;
        await this.mongo.connect();
    }

    async initWS(httpServer: Server): Promise<void> {
        this.ws = new WSServer(
            httpServer,
            (client, data) => logger.info('CONNECTED'),
            (client) => logger.info('CLOSED'),
            (data) => logger.info('MESSAGE')
        );
        this.ws.init();
    }
}

export default new Libs();
