import { after } from 'mocha';

after(async function () {
    await this.mongo.db.dropDatabase();

    // disconnect to from the mongo
    await this.mongo.disconnect();
});
