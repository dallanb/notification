import WebSocket, { ServerOptions } from 'ws';
import { Server as HTTPServer } from 'http';
import httpStatus from 'http-status';
import { get as _get, set as _set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'url';
import { RedisClient } from '../index';
import { logger } from '../../common';

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
                const uuid = _get(info, [
                    'req',
                    'headers',
                    'x-consumer-custom-id',
                ]);
                if (!uuid) {
                    cb(false, httpStatus.UNAUTHORIZED, httpStatus[404]);
                }
                _set(info, ['req', 'user'], uuid);
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

            const interval = setInterval(() => {
                this.wss?.clients.forEach((client) => {
                    if (!_get(client, ['isAlive'])) return client.terminate();

                    _set(client, ['isAlive'], false);
                    client.ping();
                });
            }, 30000);

            this.wss.on('close', () => {
                clearInterval(interval);
            });
            logger.info('WS Server is ready');
        } catch (e) {
            logger.info(e);
        }
    }

    _onConnect(ws: WebSocket, request: Request): void {
        // find id's
        const socketId = this._generateUUID();
        const type = this._getConnectionType(request);
        const uuid = this._getUUIDByTopic(type, request);

        if (!uuid) {
            throw new Error(`Invalid uuid, cannot connect`);
        }

        // set id's
        _set(ws, ['id'], socketId);
        _set(ws, ['uuid'], uuid);
        _set(ws, ['type'], type);

        switch (type) {
            case 'notification':
                this.pushClientConnection(uuid, socketId);
                break;
            case 'topic':
                this.pushTopicConnection(uuid, socketId);
                break;
        }
        this.setSocketById(socketId, ws);

        // handling for broken connections
        _set(ws, ['isAlive'], true);
        ws.on('pong', () => this._heartbeat(ws));

        this.connectionHandler(ws, { uuid });
    }

    _onMessage(data: WebSocket.Data): void {
        this.messageListener(data);
    }

    _onClose(ws: WebSocket): void {
        const uuid = _get(ws, ['uuid']);
        const socketId = _get(ws, ['id']);
        const type = _get(ws, ['type']);

        switch (type) {
            case 'notification':
                this.removeClientConnection(uuid, socketId);
                break;
            case 'topic':
                this.removeTopicConnection(uuid, socketId);
                break;
        }

        this.delSocketById(socketId);
        this.closeHandler(ws);
    }

    _heartbeat(ws: WebSocket): void {
        _set(ws, ['isAlive'], true);
    }

    _generateUUID(): string {
        return uuidv4();
    }

    _retrieveRequestBaseURL(req: Request) {
        const host = _get(req, ['headers', 'x-forwarded-host'], null);
        const endpoint = _get(req, ['url'], '');
        const url = new URL(endpoint, `http://${host}`);
        const pathname = url.pathname;
        return pathname.substring(1);
    }

    _getConnectionType(req: Request) {
        return this._retrieveRequestBaseURL(req);
    }

    _getUUIDByTopic(topic: string, req: Request): string | undefined {
        let uuid = undefined;
        switch (topic) {
            case 'notification':
                uuid = _get(req, ['user'], undefined);
                break;
            case 'topic':
                const query = parse(_get(req, ['url'], ''), true).query;
                uuid = _get(query, ['uuid'], undefined);
                break;
        }
        return uuid;
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

    async sendMessageToTopic(uuid: string, message: string): Promise<void> {
        try {
            const connections = await this.dumpTopicConnections(uuid);
            for (const connection of connections) {
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

    async pushTopicConnection(uuid: string, socketId: string): Promise<void> {
        return await RedisClient.push(`topics:${uuid}`, socketId);
    }

    async dumpClientConnections(uuid: string): Promise<string[]> {
        return await RedisClient.range(`clients:${uuid}`);
    }

    async dumpTopicConnections(uuid: string): Promise<string[]> {
        return await RedisClient.range(`topics:${uuid}`);
    }

    async removeClientConnection(
        uuid: string,
        socketId: string
    ): Promise<void> {
        return await RedisClient.rem(`clients:${uuid}`, socketId);
    }

    async removeTopicConnection(uuid: string, socketId: string): Promise<void> {
        return await RedisClient.rem(`topics:${uuid}`, socketId);
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
