import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Notification } from '../../models';

class Notifications {
    public static async fetchAll(req: Request, res: Response): Promise<any> {
        const { recipient, page = 1, per_page = 10 }: any = req.query;

        try {
            const notifications = await Notification.find({ recipient })
                .limit(per_page * 1)
                .skip((page - 1) * per_page)
                .exec();

            const count = await Notification.countDocuments();

            res.json({
                msg: 'OK',
                data: {
                    notifications,
                },
                _metadata: {
                    total_count: count,
                    page_count: notifications.length,
                    page,
                    per_page,
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
