import { before } from 'mocha';
import { PgPool } from '../../src/libs';
import { globals } from '../helpers';

before(async function () {
    // connect to pg
    globals.pg = PgPool;
});
