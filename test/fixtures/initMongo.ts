import { before } from 'mocha';
import { MongoDB } from '../../src/libs';
import { globals } from '../helpers';

before(async function () {
    // connect to mongo
    globals.mongo = MongoDB;
    globals.mongo.connect();
    // wipe db
    globals.mongo.db.dropDatabase();
});
