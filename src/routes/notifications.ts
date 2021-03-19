import express from 'express';

import { Notifications } from '../controllers';

const router = express.Router();

router.get('/', Notifications.fetchAll);
router.get('/pending', Notifications.pending);
router.put('/:_id', Notifications.update);
router.put('/user', Notifications.updateByUser);

export default router;
