const router = require('express').Router();
const {
    dashboardController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
} = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const createProfileValidator = require('../validator/dashboard/createProfileValidator');

router.get('/', isAuthenticated, dashboardController);

router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post(
    '/create-profile',
    isAuthenticated,
    createProfileValidator,
    createProfilePostController
);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, editProfilePostController);

module.exports = router;
