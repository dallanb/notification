import chai from 'chai';
import chaiHttp from 'chai-http';
import config from '../../../src/config';
import { before, describe, it } from 'mocha';
// @ts-ignore
import { seedNotification } from '../../helpers';
import { Notification } from '../../../src/models';
import { generateUUID } from '../../../src/common/utils';

// Assertion style
chai.should();
chai.use(chaiHttp);

const host = `${config.HOST}:${config.PORT}`;

let notification: any = null;
const recipient = generateUUID();
const sender = generateUUID();

describe('Notifications API', async function () {
    before(async function () {
        // wipe the db
        await Notification.deleteMany({});
        // seed a score instance
        notification = await seedNotification(recipient, sender);
    });
    /*
    GIVEN a Express application configured for testing
    WHEN the GET endpoint 'fetchAll' is requested
    THEN check that the response is valid
    */
    describe('GET /notifications', function () {
        it('should get all notifications', async function () {
            try {
                const res = await chai
                    .request(host)
                    .get('/notifications')
                    .set('x-consumer-custom-id', recipient);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
                res.body.should.have.nested.property('data.notifications');
                const notifications = res.body.data.notifications;
                notifications.should.have.length(1);
            } catch (err) {
                throw err;
            }
        });
    });
    /*
    GIVEN a Express application configured for testing
    WHEN the GET endpoint 'pending' is requested
    THEN check that the response is valid
    */
    describe('GET /notifications/pending', function () {
        it('should get the number of pending notifications', async function () {
            try {
                const res = await chai
                    .request(host)
                    .get('/notifications/pending')
                    .set('x-consumer-custom-id', recipient);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
                res.body.should.have.nested.property('data.count');
                const count = res.body.data.count;
                count.should.eq(1);
            } catch (err) {
                throw err;
            }
        });
    });
    /*
    GIVEN a Express application configured for testing
    WHEN the PUT endpoint 'update' is requested
    THEN check that the response is valid
    */
    describe('PUT /notifications/:_id', function () {
        it('should update a notification', async function () {
            try {
                const update = { read: true };
                const res = await chai
                    .request(host)
                    .put(`/notifications/${notification._id}`)
                    .set('x-consumer-custom-id', recipient)
                    .send(update);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eq('OK');
                res.body.should.have.nested.property('data.notifications');
                const notifications = res.body.data.notifications;
                notifications.should.have.property('read').eq(update.read);
            } catch (err) {
                throw err;
            }
        });
    });
});
