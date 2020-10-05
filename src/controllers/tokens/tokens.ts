import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Libs } from '../../providers';
import { logger } from '../../common';

class Tokens {
    public static async create(req: Request, res: Response): Promise<any> {
        try {
            const { uuid, token } = req.body;
            logger.info(uuid);
            logger.info(token);
            await Libs.redis.set(uuid, JSON.stringify({ token }));
            res.json({
                msg: 'OK',
                data: null,
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

export default Tokens;
