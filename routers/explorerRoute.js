const router = require('express').Router();
const { explorerController } = require('../controllers/explorerController');

router.get('/', explorerController);

module.exports = router;
