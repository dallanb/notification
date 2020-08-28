import express from 'express';

import { Ping } from '../controllers';

const router = express.Router();

router.get('/', Ping.index);

export default router;
