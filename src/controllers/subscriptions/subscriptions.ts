import { Request, Response } from 'express';
import httpStatus from 'http-status';
import libs from '../../providers/libs';

class Subscriptions {
    public static async subscribe(req: Request, res: Response): Promise<any> {
        const subscriber = req.header('x-consumer-custom-id');
        const { topic, uuid } = req.body;
        const subscription = {
            ctime: +new Date(),
            topic,
            uuid,
            user_uuid: subscriber,
        };
        try {
            await libs.pg.none(
                'insert into subscription(ctime, topic, uuid, user_uuid)' +
                    'values(${ctime}, ${topic}, ${uuid}, ${user_uuid})',
                subscription
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
            await libs.pg.none(
                'delete from subscription where topic = $1 and uuid = $2 and user_uuid = $3',
                topic,
                uuid,
                unsubscriber
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
