import express from 'express';

import { Tokens } from '../controllers';

const router = express.Router();

router.post('/', Tokens.create);

export default router;
