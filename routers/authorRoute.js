const authorController = require('../controllers/authorController');
const router = require('express').Router();

router.get('/:userId', authorController);

module.exports = router;
