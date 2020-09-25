import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Notification } from '../../models';

class Notifications {
    public static async fetchAll(req: Request, res: Response): Promise<any> {
        const { page = 1, per_page = 10 }: any = req.query;
        const recipient = req.header('x-consumer-custom-id');
        try {
            const notifications = await Notification.paginate(
                {
                    recipient,
                },
                {
                    page,
                    limit: per_page,
                }
            );

            res.json({
                msg: 'OK',
                data: {
                    notifications: notifications.docs,
                    _metadata: {
                        total_count: notifications.totalDocs,
                        page_count: notifications.docs.length,
                        page,
                        per_page,
                    },
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

    public static async update(req: Request, res: Response): Promise<any> {
        const { _id } = req.params;
        const { body: $set } = req;

        try {
            const notification = await Notification.findByIdAndUpdate(_id, {
                $set,
            }).exec();

            res.json({
                msg: 'OK',
                data: {
                    notifications: notification,
                },
            });
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                msg: httpStatus[500],
                data: null,
                err,
            });
        }
    }
}

export default Notifications;
