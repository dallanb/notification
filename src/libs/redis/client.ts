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

    private _get(
        key: string,
        resolve: (reply: string | null) => void,
        reject: (err: Error) => void
    ): any {
        this.client.get(key, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    }

    private _set(
        key: string,
        val: string,
        resolve: (reply: string | null) => void,
        reject: (err: Error) => void
    ): any {
        this.client.set(key, val, (err, reply) => {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    }

    get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._get(key, resolve, reject);
        });
    }
    set(key: string, val: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._set(key, val, resolve, reject);
        });
    }
}

export default new Client();
