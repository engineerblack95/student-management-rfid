const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rfidController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', ctrl.getAll);
router.post('/', ctrl.assign);
router.put('/:id', ctrl.updateStatus);
router.put('/:id/uid', requireAdmin, ctrl.updateUid);
router.delete('/:id', requireAdmin, ctrl.remove);

module.exports = router;