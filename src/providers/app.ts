import { logger } from '../common';
import express from 'express';
import http, { Server } from 'http';
import config from '../config';

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
        this.httpServer.listen(config.PORT, () => {
            logger.info(`Server Started. Running at port ${config.PORT}`);
        });
    }
}

export default new App();
