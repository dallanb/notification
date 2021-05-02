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
import {
    Account,
    Auth,
    Contest,
    Course,
    League,
    Member,
    Score,
    Sport,
    Wager,
} from '../events';

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
                case Constants.TOPICS.ACCOUNTS:
                    try {
                        Account.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.AUTH:
                    try {
                        Auth.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.CONTESTS:
                    try {
                        Contest.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.COURSES:
                    try {
                        Course.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.LEAGUES:
                    try {
                        League.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.MEMBERS:
                    try {
                        Member.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.SCORES:
                    try {
                        Score.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.SPORTS:
                    try {
                        Sport.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
                    break;
                case Constants.TOPICS.WAGERS:
                    try {
                        Wager.handleEvent(key, value);
                    } catch (e) {
                        logger.error(e);
                    }
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
            client => logger.info('CLOSED'),
            data => logger.info('MESSAGE')
        );
        this.ws.init();
    }
}

export default new Libs();
