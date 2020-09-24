import { logger } from '../../common';
import amqp from 'amqplib/callback_api';
import config from '../../config';

class Producer {
    private _connection: any;
    private readonly _connectionOptions: {
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
        this._connectionOptions = {
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
            { ...this._connectionOptions },
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
            (createErr: Error, ch: amqp.ConfirmChannel) => {
                if (this.closeOnErr(createErr)) {
                    return;
                }

                ch.on('error', (channelErr: Error): any =>
                    logger.error('[AMQP] channel closed', channelErr)
                );

                ch.on('close', (closeErr: Error): any =>
                    logger.info('[AMQP] channel closed', closeErr)
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
                (pubErr: Error, ok: any): void => {
                    if (pubErr) {
                        logger.error('[AMQP] publish', pubErr);
                        this.offlinePubQueue.push([exchange, '', message]);
                        this.channel.close((closeErr: Error) =>
                            logger.error('[AMQP] close', closeErr)
                        );
                    }
                }
            );
        } catch (e) {
            logger.error('[AMQP] publish', e.message);
            this.offlinePubQueue.push([exchange, '', message]);
        }
    }

    closeOnErr(err: Error): boolean {
        if (!err) return false;
        logger.error('[AMQP] error', err);
        this.connection.close();
        return true;
    }
}

export default new Producer();
