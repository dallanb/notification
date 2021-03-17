import { after } from 'mocha';
import { globals } from '../helpers';

after(async function () {
    await globals.mongo.db.dropDatabase();

    // disconnect to from the mongo
    await globals.mongo.disconnect();
});
