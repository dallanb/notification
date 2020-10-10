import express from 'express';

import { Subscriptions } from '../controllers';

const router = express.Router();

router.post('/subscribe', Subscriptions.subscribe);
router.delete('/unsubscribe', Subscriptions.unsubscribe);

export default router;
