import { logger } from '../../common';
import WebSocket, { ServerOptions } from 'ws';
import { Server as HTTPServer } from 'http';

class Server {
    private _wss?: WebSocket.Server;
    private readonly _serverOptions: ServerOptions;
    private readonly listener: (data: WebSocket.Data) => void;

    constructor(server: HTTPServer, listener: (data: WebSocket.Data) => void) {
        this._wss = undefined;
        this._serverOptions = {
            server,
        };
        this.listener = listener;
    }

    get wss(): WebSocket.Server | undefined {
        return this._wss;
    }

    set wss(wss: WebSocket.Server | undefined) {
        this._wss = wss;
    }

    init(): void {
        try {
            this.wss = new WebSocket.Server(this._serverOptions);
            this.wss.on('connection', (ws: WebSocket) => {
                logger.info('connected');
                logger.info('client Set length: ', this.wss?.clients.size);
                ws.on('message', (data: WebSocket.Data) => {
                    this.listener(data);
                });
                ws.on('close', (client: number) => {
                    logger.info('closed');
                    logger.info('Number of clients: ', this.wss?.clients.size);
                });
            });
            logger.info('WS Server is ready');
        } catch (e) {
            logger.info(e);
        }
    }
}

export default Server;
