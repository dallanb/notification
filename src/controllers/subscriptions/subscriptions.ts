import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Libs } from '../../providers';

class Subscriptions {
    public static async subscribe(req: Request, res: Response): Promise<any> {
        const subscriber = req.header('x-consumer-custom-id');
        const { topic, uuid } = req.body;
        try {
            await Libs.pg.query(
                'INSERT INTO subscription(ctime, topic, uuid, user_uuid)' +
                    'VALUES($1, $2, $3, $4)',
                [+new Date(), topic, uuid, subscriber]
            );
            res.json({
                msg: 'OK',
            });
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                msg: httpStatus[500],
                data: null,
                err: JSON.stringify(err),
            });
        }
    }

    public static async unsubscribe(req: Request, res: Response): Promise<any> {
        const unsubscriber = req.header('x-consumer-custom-id');
        const { topic, uuid } = req.body;
        try {
            await Libs.pg.query(
                'DELETE FROM subscription WHERE topic = $1 AND uuid = $2 AND user_uuid = $3',
                [topic, uuid, unsubscriber]
            );
            res.json({
                msg: 'OK',
            });
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                msg: httpStatus[500],
                data: null,
                err: JSON.stringify(err),
            });
        }
    }
}

export default Subscriptions;
