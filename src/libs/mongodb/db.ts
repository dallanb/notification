import config from '../../config';
import { logger } from '../../common';
import mongoose from 'mongoose';
import { Connection } from 'mongoose';

class DB {
    private _db: any;
    private readonly _uri: string;
    constructor() {
        this._db = undefined;
        this._uri = config.MONGO_URL;
    }

    get db(): Connection {
        return this._db;
    }

    set db(db: Connection) {
        this._db = db;
    }

    async connect(): Promise<void> {
        this.db = mongoose.connection;
        this.db.on('error', (err: Error) =>
            logger.error('Connection Error: ', err)
        );
        this.db.on('open', () => logger.info('Connection Open'));

        await mongoose.connect(this._uri, { useNewUrlParser: true });
    }
}

export default new DB();
