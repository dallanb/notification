import logger from 'winston';
import redis, { RedisClient } from 'redis';
import config from '../../config';

class Client {
    private _client: any;
    private readonly _clientOptions: { port: number; host: string };
    constructor() {
        this._client = undefined;
        this._clientOptions = {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
        };
    }

    get client(): RedisClient {
        return this._client;
    }

    set client(client: RedisClient) {
        this._client = client;
    }

    connect(): void {
        this.client = redis.createClient(this._clientOptions);

        this.client.on('connect', () => logger.info('Client is now connected'));
    }
}

export default new Client();
