const UserModel = require('../../models/User');
const { body } = require('express-validator');

// Express Validator
module.exports = signUpValidator = [
    body('username')
        .isLength({ min: 2, max: 15 })
        .withMessage('Username must be 2 to 15 Chars')
        .custom(async (username) => {
            let user = await UserModel.findOne({ username });
            if (user) {
                return Promise.reject('Username Already Exits');
            }
        })
        .trim(),

    body('email')
        .isEmail()
        .withMessage('Email is Required')
        .custom(async (email) => {
            let Email = await UserModel.findOne({ email });
            if (Email) {
                return Promise.reject('Email Already Exits');
            }
        })
        .normalizeEmail(),

    body('password')
        .isLength({ min: 5 })
        .withMessage('Password Minimum 5 Chars'),

    body('confirmPassword').custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
];
