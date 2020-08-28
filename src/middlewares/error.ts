import { HTTPException } from '../common';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

const errorHandler = (
    error: HTTPException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[500];

    response.status(status).json({ msg: message, data: null, err: null });
};

export default errorHandler;
