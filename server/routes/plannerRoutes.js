const express = require('express');
const router = express.Router();
const { getSchedule } = require('../controllers/plannerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, getSchedule);

module.exports = router;
