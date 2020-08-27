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
        vhost: string;
    };
    private _channel: any;
    private _offlinePubQueue: any[];

    constructor() {
        this._connection = undefined;
        this._connection_options = {
            protocol: 'amqp',
            hostname: config.RABBITMQ_HOST,
            port: config.RABBITMQ_PORT,
            username: config.RABBITMQ_USERNAME,
            password: config.RABBITMQ_PASSWORD,
            vhost: config.RABBITMQ_VHOST,
        };
        this._channel = undefined;
        this._offlinePubQueue = [];
    }

    get connection(): amqp.Connection {
        return this._connection;
    }

    set connection(conn: amqp.Connection) {
        this._connection = conn;
    }

    get channel(): amqp.ConfirmChannel {
        return this._channel;
    }

    set channel(channel: amqp.ConfirmChannel) {
        this._channel = channel;
    }

    get offlinePubQueue(): any[] {
        return this._offlinePubQueue;
    }

    set offlinePubQueue(offlinePubQueue) {
        this._offlinePubQueue = offlinePubQueue;
    }

    connect(): void {
        amqp.connect(
            { ...this._connection_options },
            (err: Error, connection: amqp.Connection) => {
                if (err) {
                    throw err;
                }
                this.connection = connection;
                this.startPublisher();
            }
        );
    }

    startPublisher(): void {
        this.connection.createConfirmChannel(
            (err: Error, ch: amqp.ConfirmChannel) => {
                if (this.closeOnErr(err)) {
                    return;
                }

                ch.on('error', (err: Error): void =>
                    console.error('[AMQP] channel closed', err)
                );

                ch.on('close', (): void =>
                    console.log('[AMQP] channel closed', err)
                );

                this.channel = ch;

                while (true) {
                    const m = this.offlinePubQueue.shift();
                    if (!m) break;
                    this.publish(m[0], m[1], m[2]);
                }
            }
        );
    }

    // method to publish a message, will queue messages internally if the connection is down and resend later
    publish(exchange: string, exchangeType: string, message: any): void {
        try {
            this.channel.assertExchange(exchange, exchangeType, {
                durable: false,
            });
            this.channel.publish(
                exchange,
                '',
                Buffer.from(message),
                {
                    persistent: true,
                },
                (err: Error, ok: any): void => {
                    if (err) {
                        console.error('[AMQP] publish', err);
                        this.offlinePubQueue.push([exchange, '', message]);
                        this.channel.close((err: Error) =>
                            console.error('[AMQP] close', err)
                        );
                    }
                }
            );
        } catch (e) {
            console.error('[AMQP] publish', e.message);
            this.offlinePubQueue.push([exchange, '', message]);
        }
    }

    closeOnErr(err: Error): boolean {
        if (!err) return false;
        console.error('[AMQP] error', err);
        this.connection.close();
        return true;
    }
}

export default new Producer();
