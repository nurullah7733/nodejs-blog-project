const router = require('express').Router();
const signUpValidator = require('../validator/auth/signupValidator');
const loginValidator = require('../validator/auth/loginValidator');
const { authenticated } = require('../middleware/authMiddleware');

const {
    SignupGetController,
    SignupPostController,
    LoginGetController,
    LoginPostController,
    LogoutController,
} = require('../controllers/authController');

router.get('/sign-up', authenticated, SignupGetController);

router.post('/sign-up', authenticated, signUpValidator, SignupPostController);

router.get('/login', authenticated, LoginGetController);
router.post('/login', authenticated, loginValidator, LoginPostController);

router.get('/logout', LogoutController);

module.exports = router;
