const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/attendanceController');
const { authMiddleware, requireAdmin } = require('../middleware/authMiddleware');

// ESP32 hits this — NO auth
router.post('/scan', ctrl.scan);

// Everything else requires auth
router.get('/', authMiddleware, ctrl.history);
router.get('/report/today', authMiddleware, ctrl.todayReport);
router.delete('/:id', authMiddleware, requireAdmin, ctrl.remove);

module.exports = router;