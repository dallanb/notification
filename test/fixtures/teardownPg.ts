import { after } from 'mocha';
import { globals } from '../helpers';

after(async function () {
    // disconnect to from the pg
    globals.pg.end();
});
