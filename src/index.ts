// express
import express from 'express';
const app = express();

// dependencies
import bodyParser from 'body-parser';
import cors from 'cors';

app.use(bodyParser.json());
app.use(cors());

// libs
// TODO: clean this up
import { Consumer, Producer } from './libs';
import { listener } from './event';
new Consumer(listener).run();
Producer.connect();

// routes
import routes from './routes';
app.use(routes);

// middlewares
import { errorHandler, logger, notFoundHandler } from './middlewares';
app.use(logger);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(process.env.PORT, () => {
    console.log('Server Started');
});
