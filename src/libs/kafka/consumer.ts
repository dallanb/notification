import { logger } from '../../common';
import {
    KafkaClient,
    Consumer as KafkaConsumer,
    Message,
    Offset,
} from 'kafka-node';
import config from '../../config';

class Consumer {
    private readonly _client: KafkaClient;
    private readonly _topics: any[];
    private readonly _options: any;
    private readonly listener: (event: Message) => void;
    private readonly _offset: Offset;

    constructor(listener: (event: Message) => void) {
        this._client = new KafkaClient({
            kafkaHost: `${config.KAFKA_HOST}:${config.KAFKA_PORT}`,
        });
        this._topics = config.KAFKA_TOPICS.map((topic) => {
            return { topic };
        });
        this._options = {};
        this._offset = new Offset(this.client);
        this.listener = listener;
    }

    get topics(): any[] {
        return this._topics;
    }

    get client(): KafkaClient {
        return this._client;
    }

    get options(): any {
        return this._options;
    }

    get offset(): Offset {
        return this._offset;
    }

    run = (): void => {
        try {
            const consumer = new KafkaConsumer(
                this._client,
                this._topics,
                this._options
            );

            consumer.on('message', (event: Message) => {
                logger.info('Message received: ', event);
                this.listener(event);
            });

            consumer.on('offsetOutOfRange', (topic: any) => {
                topic.maxNum = 2;
                this.offset.fetch([topic], (err: Error, offsets: any) => {
                    if (err) {
                        return logger.error(err);
                    }
                    const min = Math.min.apply(
                        null,
                        offsets[topic.topic][topic.partition]
                    );
                    consumer.setOffset(topic.topic, topic.partition, min);
                });
            });

            consumer.on('error', (error: Error) =>
                logger.error('Kafka Consumer error: ', error)
            );
            logger.info('Kafka Consumer ready');
            return;
        } catch (e) {
            logger.info(e);
        }
    };
}

export default Consumer;
