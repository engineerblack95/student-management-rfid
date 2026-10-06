const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rfidController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.assign);
router.put('/:id', ctrl.updateStatus);

module.exports = router;