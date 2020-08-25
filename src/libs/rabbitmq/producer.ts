import amqp from 'amqplib/callback_api';
import config from '../../config';

class Producer {
    private _rabbitmqHost: string;
    constructor() {
        this._rabbitmqHost = `amqp://${config.RABBITMQ_HOST}`;
    }

    connect;
}
