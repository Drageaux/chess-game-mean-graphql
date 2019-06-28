import * as express from 'express';

import messages from './messages.route';
import boards from './boards.route';
import moves from './moves.route';

const router = express.Router();

router.use('/messages', messages);
router.use('/boards', boards);
router.use('/moves', moves);

export default router;
