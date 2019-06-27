import * as express from 'express';

import messages from './messages.route';
import boards from './boards.route';

let router = express.Router();

router.use('/messages', messages);
router.use('/boards', boards);

export default router;