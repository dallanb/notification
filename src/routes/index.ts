import express from 'express';

import pingRouter from './ping';
import notificationsRouter from './notifications'

const router = express.Router();

router.use('/ping', pingRouter);
router.use('/notifications', notificationsRouter);

export default router;
