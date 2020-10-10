import {
    KafkaConsumer,
    MongoDB,
    PgPool,
    RabbitMQProducer,
    RedisClient,
    WSServer,
} from '../libs';
import { logger, Constants } from '../common';
import { Server } from 'http';
import { Message } from 'kafka-node';
import { Account, Auth, Contest, Score, Sport, Wager } from '../services';

class Libs {
    mongo: any;
    kafka: any;
    pg: any;
    redis: any;
    rabbitmq: any;
    ws: any;

    constructor() {
        this.kafka = undefined;
        this.mongo = undefined;
        this.pg = undefined;
        this.redis = undefined;
        this.rabbitmq = undefined;
        this.ws = undefined;
    }

    async initKafka(): Promise<void> {
        this.kafka = new KafkaConsumer(({ topic, key, value }: Message) => {
            switch (topic) {
                case Constants.TOPICS.AUTH:
                    Auth.handleEvent(key, value);
                    break;
                case Constants.TOPICS.ACCOUNTS:
                    Account.handleEvent(key, value);
                    break;
                case Constants.TOPICS.CONTESTS:
                    Contest.handleEvent(key, value);
                    break;
                case Constants.TOPICS.SCORES:
                    Score.handleEvent(key, value);
                    break;
                case Constants.TOPICS.SPORTS:
                    Sport.handleEvent(key, value);
                    break;
                case Constants.TOPICS.WAGERS:
                    Wager.handleEvent(key, value);
                    break;
                default:
                    throw new Error('Invalid topic');
            }
        });
        this.kafka.run();
    }

    async initPG(): Promise<void> {
        this.pg = PgPool;
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
