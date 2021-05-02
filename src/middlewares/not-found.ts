import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const code = httpStatus.NOT_FOUND;
    const message = httpStatus[404];
    response.status(code).json({ msg: message, data: null, err: null });
    next();
};

export default notFoundHandler;
