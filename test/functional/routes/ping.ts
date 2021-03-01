import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../../src/config';
import { describe, it } from 'mocha';

// Assertion style
chai.should();
chai.use(chaiHttp);

const host = `${config.HOST}:${config.PORT}`;

describe('Ping API', function () {
    /*
    GIVEN a Express application configured for testing
    WHEN the GET endpoint 'ping' is requested
    THEN check that the response is valid
    */
    describe('GET /ping', function () {
        it('should ping', async function () {
            try {
                const res = await chai.request(host).get('/ping');
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
            } catch (err) {
                throw err;
            }
        });
    });
});
