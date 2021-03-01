import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../../src/config';
import { describe, it } from 'mocha';
// @ts-ignore
import { deleteAllSubscriptions, seedSubscription } from '../../helpers';
import { generateUUID } from '../../../src/common/utils';

// Assertion style
chai.should();
chai.use(chaiHttp);

const host = `${config.HOST}:${config.PORT}`;
const user = generateUUID();

describe('Tokens API', function () {
    /*
    GIVEN a Express application configured for testing
    WHEN the POST endpoint 'create' is requested
    THEN check that the response is valid
    */
    describe('POST /tokens', function () {
        it('should create a token', async function () {
            try {
                const res = await chai
                    .request(host)
                    .post('/tokens')
                    .set('x-consumer-custom-id', user)
                    .send({
                        token: '123',
                    });
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
            } catch (err) {
                throw err;
            }
        });
    });
});
