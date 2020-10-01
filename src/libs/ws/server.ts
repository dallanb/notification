import { logger } from '../../common';
import ws, { ServerOptions } from 'ws';
import config from '../../config';

class Server {
    private _server?: any;
    private _socket?: WebSocket;
    private readonly _serverOptions: ServerOptions;

    constructor() {
        this._server = undefined;
        this._socket = undefined;
        this._serverOptions = {
            port: config.WS_PORT,
        };
    }

    get server(): any {
        return this._server;
    }

    set server(server: any) {
        this._server = server;
    }

    get socket(): WebSocket | undefined {
        return this._socket;
    }

    set socket(socket: WebSocket | undefined) {
        this._socket = socket;
    }

    connect(): void {
        try {
            this.server = new ws.Server(this._serverOptions);
            this.server.on('connection', (socket: ) => {
                this.socket = socket;
                console.log('connected');
                console.log('client Set length: ', socketServer.clients.size);
                socketClient.on('close', (socketClient) => {
                    console.log('closed');
                    console.log(
                        'Number of clients: ',
                        socketServer.clients.size
                    );
                });
            });
            logger.info('WS Server is ready');
        } catch (e) {
            logger.info(e);
        }
    }
}

export default Server;
