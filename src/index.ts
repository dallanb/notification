import express from 'express';
import cors from 'cors';

import { ping } from './routes';

const app = express();

app.use(cors());

app.use('/ping', ping);

app.listen(3000, () => {
    console.log('Server Started at Port, 3000');
});
