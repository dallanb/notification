import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Notification } from '../../models';
import { logger } from '../../common';

class Notifications {
    public static fetchAll(req: Request, res: Response): any {
        const { recipient } = req.query;
        logger.info(recipient);
        Notification.find({ recipient })
            .exec()
            .then((notifications: any) =>
                res.json({
                    msg: 'OK',
                    data: {
                        notifications,
                    },
                })
            )
            .catch((err: Error) =>
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    msg: httpStatus[500],
                    data: null,
                    err: JSON.stringify(err),
                })
            );
    }

    public static update(req: Request, res: Response): any {
        const { _id } = req.params;
        const { body: $set } = req;

        Notification.findByIdAndUpdate(_id, { $set })
            .exec()
            .then((notification: any) => {
                res.json({
                    msg: 'OK',
                    data: {
                        notifications: notification,
                    },
                });
            })
            .catch((err: Error) =>
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                    msg: httpStatus[500],
                    data: null,
                    err: JSON.stringify(err),
                })
            );
    }
}

export default Notifications;
