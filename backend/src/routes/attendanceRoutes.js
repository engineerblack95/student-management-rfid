const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/attendanceController');

router.post('/scan', ctrl.scan);
router.get('/', ctrl.history);
router.get('/report/today', ctrl.todayReport);

module.exports = router;