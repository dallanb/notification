import { KafkaClient, Consumer as KafkaConsumer, Message } from 'kafka-node';
import config from '../../config';

class Consumer {
    private readonly _client: KafkaClient;
    private readonly _topics: Array<any>;
    private readonly _options: any;
    private readonly listener: (event: Message) => void;

    constructor(listener: (event: Message) => void) {
        this._client = new KafkaClient({
            kafkaHost: `${config.KAFKA_HOST}:${config.KAFKA_PORT}`,
        });
        this._topics = config.KAFKA_TOPICS.map((topic) => {
            return { topic };
        });
        this._options = {};
        this.listener = listener;
    }

    get topics(): Array<any> {
        return this._topics;
    }

    get client(): KafkaClient {
        return this._client;
    }

    get options(): any {
        return this._options;
    }

    run = (): void => {
        try {
            const consumer = new KafkaConsumer(
                this._client,
                this._topics,
                this._options
            );

            consumer.on('message', (event: Message) => {
                console.log('Message received: ', event);
                this.listener(event);
            });

            consumer.on('error', (error: any) =>
                console.error('Consumer error: ', error)
            );
            console.log('Consumer ready');
            return;
        } catch (e) {
            console.log(e);
        }
    };
}

export default Consumer;
