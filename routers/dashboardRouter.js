const router = require('express').Router();
const dashobardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, dashobardController);

module.exports = router;
