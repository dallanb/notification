import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Libs } from '../../providers';

class Subscriptions {
    public static async fetch(req: Request, res: Response): Promise<any> {
        const user = req.header('x-consumer-custom-id');
        const { uuid }: any = req.query;
        try {
            const query = await Libs.pg.query(
                'SELECT COUNT(id) FROM subscription WHERE uuid = $1 and user_uuid = $2',
                [uuid, user]
            );
            res.json({
                msg: 'OK',
                data: {
                    subscribed: query.rowCount > 0,
                },
            });
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                msg: httpStatus[500],
                data: null,
                err: JSON.stringify(err),
            });
        }
    }

    public static async subscribe(req: Request, res: Response): Promise<any> {
        const subscriber = req.header('x-consumer-custom-id');
        const { uuid } = req.body;
        try {
            await Libs.pg.query(
                'INSERT INTO subscription(ctime, uuid, user_uuid)' +
                    'VALUES($1, $2, $3)',
                [+new Date(), uuid, subscriber]
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
        const { uuid } = req.body;
        try {
            await Libs.pg.query(
                'DELETE FROM subscription WHERE uuid = $1 AND user_uuid = $2',
                [uuid, unsubscriber]
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
