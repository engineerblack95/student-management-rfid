const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

// Authenticated users
router.get('/', authMiddleware, ctrl.getAll);
router.get('/:id', authMiddleware, ctrl.getOne);
router.get('/:id/full', authMiddleware, ctrl.getFull);
router.post('/', authMiddleware, ctrl.create);
router.put('/:id', authMiddleware, ctrl.update);

// Admin only
router.delete('/:id', authMiddleware, requireAdmin, ctrl.remove);
router.delete('/:id/hard', authMiddleware, requireAdmin, ctrl.hardDelete);

module.exports = router;