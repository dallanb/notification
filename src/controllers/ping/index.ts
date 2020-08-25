import { Request, Response } from 'express';

class Ping {
    public static index(req: Request, res: Response): any {
        return res.json({
            msg: 'OK',
            data: {
                message: 'pong',
            },
        });
    }
}

export default Ping;
