import { App, Libs, Middlewares, Routes } from './providers';

const run = async () => {
    Middlewares.initBodyParser(App.application);
    Middlewares.initCors(App.application);

    await Libs.initRabbitMQ();
    await Libs.initKafka();

    // routes
    Routes.init(App.application);

    // middlewares
    Middlewares.initLogger(App.application);
    Middlewares.initErrorHandler(App.application);
    Middlewares.initNotFoundHandler(App.application);

    App.listen();
};

run()
    .then(() => console.log('APP READY'))
    .catch((err) => console.error('APP NOT READY'));
