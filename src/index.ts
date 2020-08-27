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
//
// import express from 'express';
// import { Libs, Middlewares, Routes } from './providers';
// // import bodyParser from 'body-parser';
// // import cors from 'cors';
// // import { Consumer, Producer } from './libs';
// // import { Services } from './providers';
// // import routes from './routes';
// // import { errorHandler, logger, notFoundHandler } from './middlewares';
// const run = async () => {
//     // express
//     const app = express();
//
//     Middlewares.initBodyParser(app);
//     Middlewares.initCors(app);
//
//     await Libs.initRabbitMQ();
//     await Libs.initKafka();
//
//     // routes
//     Routes.init(app);
//
//     // middlewares
//     // Middlewares.initLogger(app);
//     // Middlewares.initErrorHandler(app);
//     // Middlewares.initNotFoundHandler(app);
//     // // dependencies
//     //
//     // app.use(bodyParser.json());
//     // app.use(cors());
//     //
//     //
//     // // libs
//     // // TODO: clean this up
//     // new Consumer(Services.listener).run();
//     // Producer.connect();
//     //
//     // // routes
//     // app.use(routes);
//     //
//     // // middlewares
//     // app.use(logger);
//     //
//     // app.use(errorHandler);
//     // app.use(notFoundHandler);
//
//     app.listen(process.env.PORT, () => {
//         console.log('Server Started');
//     });
// };
//
// run()
//     .then(() => {})
//     .catch(() => {});
