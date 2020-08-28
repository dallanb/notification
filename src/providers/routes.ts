import express from 'express';
import routes from '../routes';

class Routes {
    init(app: express.Application): void {
        app.use(routes);
    }
}

export default new Routes();
