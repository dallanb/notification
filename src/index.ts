import { App, Libs, Middlewares, Routes } from './providers';
import { logger } from './common';

const run = async () => {
    Middlewares.initBodyParser(App.application);
    Middlewares.initCors(App.application);
    Middlewares.initRequestLogger(App.application);

    await Libs.initRabbitMQ();
    await Libs.initKafka();
    await Libs.initPG();
    await Libs.initRedis();
    await Libs.initMongo();
    await Libs.initWS(App.httpServer);
    // routes
    Routes.init(App.application);

    // middleware
    Middlewares.initErrorLogger(App.application);
    Middlewares.initErrorHandler(App.application);
    Middlewares.initNotFoundHandler(App.application);

    App.listen();
};

run()
    .then(() => logger.info('App Ready'))
    .catch(err => logger.error('App Not Ready', err));
