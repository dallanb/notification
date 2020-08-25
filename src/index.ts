// express
import express from 'express';
const app = express();

// dependencies
import bodyParser from 'body-parser';
import cors from 'cors';

app.use(bodyParser.json());
app.use(cors());

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
