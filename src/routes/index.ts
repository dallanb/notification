import express from 'express';

import pingRouter from './ping';
import notificationsRouter from './notifications';
import tokensRouter from './tokens';

const router = express.Router();

router.use('/ping', pingRouter);
router.use('/notifications', notificationsRouter);
router.use('/tokens', tokensRouter);

export default router;
