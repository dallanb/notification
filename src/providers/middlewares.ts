import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler, notFoundHandler } from '../middlewares';

class Middlewares {
    initBodyParser(app: express.Application): void {
        app.use(bodyParser.json());
    }

    initCors(app: express.Application): void {
        app.use(
            cors({ credentials: true, origin: 'https://golf.techtapir.com' })
        );
    }

    initErrorHandler(app: express.Application): void {
        app.use(errorHandler);
    }

    initNotFoundHandler(app: express.Application): void {
        app.use(notFoundHandler);
    }
}

export default new Middlewares();
