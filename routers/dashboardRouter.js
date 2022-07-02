const router = require('express').Router();
const {
    dashboardController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    bookmarksGetController,
    commentGetController,
} = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const createProfileValidator = require('../validator/dashboard/createProfileValidator');

router.get('/bookmarks', isAuthenticated, bookmarksGetController);
router.get('/comments', isAuthenticated, commentGetController);

router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post(
    '/create-profile',
    isAuthenticated,
    createProfileValidator,
    createProfilePostController
);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, editProfilePostController);

router.get('/', isAuthenticated, dashboardController);

module.exports = router;
