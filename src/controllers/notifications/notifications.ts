import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Notification } from '../../models';
import { wsSendPending } from '../../services/utils';

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

    public static async pending(req: Request, res: Response): Promise<any> {
        const recipient = req.header('x-consumer-custom-id');
        try {
            const count = await Notification.count({
                recipient,
                read: false,
            }).exec();

            res.json({
                msg: 'OK',
                data: {
                    count,
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
        const recipient = req.header('x-consumer-custom-id');
        const { body: $set } = req;

        try {
            const notification = await Notification.findByIdAndUpdate(_id, {
                $set,
            }).exec();

            if (recipient) {
                wsSendPending(recipient);
            }

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
