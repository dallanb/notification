import express from 'express';

class App {
    private readonly _application: express.Application;

    constructor() {
        this._application = express();
    }

    get application(): express.Application {
        return this._application;
    }

    listen(): void {
        this.application.listen(process.env.PORT, () => {
            console.log('Server Started');
        });
    }
}

export default new App();
