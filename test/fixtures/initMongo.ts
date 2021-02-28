import { before } from 'mocha';
import { MongoDB } from '../../src/libs';

before(async function () {
    // connect to mongo
    this.mongo = MongoDB;
    await this.mongo.connect();
    // wipe db
    await this.mongo.db.dropDatabase();
});
