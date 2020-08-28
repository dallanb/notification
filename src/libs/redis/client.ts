import { logger } from '../../common';
import redis, { RedisClient } from 'redis';
import config from '../../config';

class Client {
    private _client: any;
    private readonly _clientOptions: { port: number; host: string };
    constructor() {
        this._client = undefined;
        this._clientOptions = {
            host: config.CACHE_HOST,
            port: config.CACHE_PORT,
        };
    }

    get client(): RedisClient {
        return this._client;
    }

    set client(client: RedisClient) {
        this._client = client;
    }

    init() {
        return new Promise((resolve, reject) => {
            this.connect(resolve, reject);
        });
    }

    connect(resolve: () => void, reject: () => void): void {
        this.client = redis.createClient(this._clientOptions);

        this.client.on('connect', () => {
            logger.info('Redis Client ready');
            resolve();
        });

        this.client.on('error', (err) => {
            logger.error('Redis Client error: ', err);
            reject();
        });
    }
}

export default new Client();
