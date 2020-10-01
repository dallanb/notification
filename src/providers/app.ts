import { logger } from '../common';
import express from 'express';
import http, { Server } from 'http';

class App {
    private readonly _application: express.Application;
    private readonly _httpServer: Server;

    constructor() {
        this._application = express();
        this._httpServer = http.createServer(this._application);
    }

    get application(): express.Application {
        return this._application;
    }

    get httpServer(): Server {
        return this._httpServer;
    }

    listen(): void {
        this.httpServer.listen(process.env.PORT, () => {
            logger.info(`Server Started. Running at port ${process.env.PORT}`);
        });
    }
}

export default new App();
