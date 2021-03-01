import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../../src/config';
import { before, describe, it } from 'mocha';
// @ts-ignore
import { deleteAllSubscriptions, seedSubscription } from '../../helpers';
import { generateUUID } from '../../../src/common/utils';
import { Notification } from '../../../src/models';

// Assertion style
chai.should();
chai.use(chaiHttp);

const host = `${config.HOST}:${config.PORT}`;
let subscription: any = null;
const contestUUID = generateUUID();
const user = generateUUID();

describe('Subscriptions API', function () {
    before(async function () {
        // wipe the db
        await deleteAllSubscriptions();
        // seed a score instance
        subscription = await seedSubscription(contestUUID, user);
    });
    /*
    GIVEN a Express application configured for testing
    WHEN the GET endpoint 'fetch' is requested
    THEN check that the response is valid
    */
    describe('GET /fetch?uuid=:contestUUID', function () {
        it('should fetch subscription identified by contestUUID and user uuid', async function () {
            try {
                const res = await chai
                    .request(host)
                    .get('/subscriptions')
                    .query({
                        uuid: contestUUID,
                    })
                    .set('x-consumer-custom-id', user);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
                res.body.should.have.nested.property('data.subscribed');
                const subscribed = res.body.data.subscribed;
                subscribed.should.eq(true);
            } catch (err) {
                throw err;
            }
        });
    });
    /*
    GIVEN a Express application configured for testing
    WHEN the POST endpoint 'subscribe' is requested
    THEN check that the response is valid
    */
    describe('POST /subscribe', function () {
        it('should create a subscription', async function () {
            try {
                const newContestUUID = generateUUID();
                const res = await chai
                    .request(host)
                    .post('/subscriptions/subscribe')
                    .set('x-consumer-custom-id', user)
                    .send({
                        uuid: newContestUUID,
                    });
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
            } catch (err) {
                throw err;
            }
        });
    });
    /*
    GIVEN a Express application configured for testing
    WHEN the DELETE endpoint 'unsubscribe' is requested
    THEN check that the response is valid
    */
    describe('DELETE /unsubscribe', function () {
        it('should delete a subscription', async function () {
            try {
                const res = await chai
                    .request(host)
                    .delete('/subscriptions/unsubscribe')
                    .set('x-consumer-custom-id', user)
                    .send({
                        uuid: contestUUID,
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
