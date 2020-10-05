import { logger } from '../../common';
import WebSocket, { ServerOptions } from 'ws';
import { Server as HTTPServer } from 'http';
import httpStatus from 'http-status';
import { parse } from 'url';
import { get as _get, set as _set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { RedisClient } from '../index';

class Server {
    private _wss?: WebSocket.Server;
    private readonly _serverOptions: ServerOptions;
    private readonly messageListener: (data: WebSocket.Data) => void;
    private readonly connectionHandler: (
        ws: WebSocket,
        data: { uuid: string }
    ) => void;
    private readonly closeHandler: (ws: WebSocket) => void;
    private readonly wsHash: { [key: string]: any };

    constructor(
        server: HTTPServer,
        connectionHandler: (ws: WebSocket, data: { uuid: string }) => void,
        closeHandler: (ws: WebSocket) => void,
        messageListener: (data: WebSocket.Data) => void
    ) {
        this._wss = undefined;
        this._serverOptions = {
            server,
            verifyClient: (info, cb) => {
                const query = parse(_get(info, ['req', 'url'], ''), true).query;
                const uuid = _get(query, ['uuid']);
                if (!uuid) {
                    cb(false, httpStatus.UNAUTHORIZED, httpStatus[404]);
                }
                _set(info, ['req', 'uuid'], uuid);
                cb(true);
            },
        };
        this.messageListener = messageListener;
        this.connectionHandler = connectionHandler;
        this.closeHandler = closeHandler;
        this.wsHash = {};
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
            this.wss.on('connection', (ws: WebSocket, request: Request) => {
                this._onConnect(ws, request);
                ws.on('message', (data: WebSocket.Data) =>
                    this._onMessage(data)
                );
                ws.on('close', () => this._onClose(ws));
            });
            logger.info('WS Server is ready');
        } catch (e) {
            logger.info(e);
        }
    }

    _onConnect(ws: WebSocket, request: Request): void {
        // find id's
        const socketId = this._generateUUID();
        const uuid = _get(request, ['uuid']);
        // console.log(this.wss?.clients);

        // set id's
        _set(ws, ['id'], socketId);
        _set(ws, ['user_uuid'], uuid);
        this.pushClientConnection(uuid, socketId);
        this.setSocketById(socketId, ws);
        this.connectionHandler(ws, { uuid });
    }

    _onMessage(data: WebSocket.Data): void {
        this.messageListener(data);
    }

    _onClose(ws: WebSocket): void {
        const uuid = _get(ws, ['user_uuid']);
        const socketId = _get(ws, ['id']);
        this.removeClientConnection(uuid, socketId);
        this.delSocketById(socketId);
        this.closeHandler(ws);
    }

    _generateUUID(): string {
        return uuidv4();
    }

    async sendMessageToClient(uuid: string, message: string): Promise<void> {
        try {
            const connections = await this.dumpClientConnections(uuid);
            for (const connection of connections) {
                // dont bother waiting
                this.sendMessage(connection, message);
            }
        } catch (err) {
            logger.error(err);
        }
    }

    async sendMessage(id: string, message: string): Promise<void> {
        try {
            const socket = await this.getSocketById(id);
            if (!socket) {
                throw new Error(`Could not find socket with id: ${id}`);
            }
            socket.send(message);
        } catch (err) {
            logger.error(err);
        }
    }

    async pushClientConnection(uuid: string, socketId: string): Promise<void> {
        return await RedisClient.push(`clients:${uuid}`, socketId);
    }

    async dumpClientConnections(uuid: string): Promise<string[]> {
        return await RedisClient.range(`clients:${uuid}`);
    }

    async removeClientConnection(
        uuid: string,
        socketId: string
    ): Promise<void> {
        return await RedisClient.rem(`clients:${uuid}`, socketId);
    }

    getSocketById(id: string): WebSocket | undefined {
        return this.wsHash[id];
    }

    setSocketById(id: string, socket: WebSocket): void {
        this.wsHash[id] = socket;
    }

    delSocketById(id: string): void {
        delete this.wsHash[id];
    }
}

export default Server;
