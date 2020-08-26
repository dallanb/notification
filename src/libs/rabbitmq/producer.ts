import amqp from 'amqplib/callback_api';
import config from '../../config';

class Producer {
    private _connection: any;
    private readonly _connection_options: {
        protocol: string;
        hostname: string;
        password: string;
        port: number;
        username: string;
    };
    constructor() {
        this._connection = undefined;
        this._connection_options = {
            protocol: 'amqp',
            hostname: config.RABBITMQ_HOST,
            port: config.RABBITMQ_PORT,
            username: config.RABBITMQ_USERNAME,
            password: config.RABBITMQ_PASSWORD,
        };
    }

    get connection(): amqp.Connection {
        return this._connection;
    }

    set connection(conn: amqp.Connection) {
        this._connection = conn;
    }

    connect(): void {
        amqp.connect(
            { ...this._connection_options },
            (err: Error, connection: amqp.Connection) => {
                if (err) {
                    throw err;
                }
                this.connection = connection;
            }
        );
    }
}

export default new Producer();
