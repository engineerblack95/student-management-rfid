const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

router.use(authMiddleware, requireAdmin);

router.get('/', ctrl.list);
router.put('/:id/role', ctrl.changeRole);
router.put('/:id/password', ctrl.resetPassword);
router.delete('/:id', ctrl.remove);

module.exports = router;