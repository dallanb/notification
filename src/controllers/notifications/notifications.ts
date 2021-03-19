import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { get as _get } from 'lodash';

import { Notification } from '../../models';
import { wsSendPending } from '../../events/utils';

class Notifications {
    public static async fetchAll(req: Request, res: Response): Promise<any> {
        const {
            page = 1,
            per_page = 10,
            sort_by = 'ctime.desc',
        }: any = req.query;
        const recipient = req.header('x-consumer-custom-id');
        try {
            const sortSplit = sort_by.split['.'];
            const sortKey = _get(sortSplit, [0], 'ctime');
            const sortOrder = _get(sortSplit, [1], 'desc') === 'asc' ? 1 : -1;
            const notifications = await Notification.paginate(
                {
                    recipient,
                    archived: false,
                },
                {
                    page,
                    limit: per_page,
                    sort: { [sortKey]: sortOrder },
                }
            );

            if (recipient) {
                await wsSendPending(recipient);
            }

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
                archived: false,
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
            const notification = await Notification.findByIdAndUpdate(
                _id,

                {
                    $set,
                },
                { new: true }
            ).exec();

            if (recipient) {
                await wsSendPending(recipient);
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

    public static async updateByUser(
        req: Request,
        res: Response
    ): Promise<any> {
        const recipient = req.header('x-consumer-custom-id');
        const { body: $set } = req;

        try {
            if (!recipient) {
                throw new Error('recipient is required');
            }

            await Notification.updateMany(
                { recipient },
                {
                    $set,
                },
                { new: true }
            ).exec();

            await wsSendPending(recipient);

            res.json({
                msg: 'OK',
                data: null,
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
