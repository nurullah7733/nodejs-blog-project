const router = require('express').Router();
const {
    explorerController,
    signlePostGetController,
} = require('../controllers/explorerController');

router.get('/', explorerController);
router.get('/post/:postId', signlePostGetController);

module.exports = router;
