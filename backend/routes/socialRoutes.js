const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getOverview, runFullSimulation } = require('../controllers/socialController');

router.get('/overview', getOverview);
router.post('/simulate-all', authMiddleware, runFullSimulation);

module.exports = router;
