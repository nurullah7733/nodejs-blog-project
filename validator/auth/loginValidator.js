const { body } = require('express-validator');
const UserModel = require('../../models/User');
const bcrypt = require('bcryptjs');

module.exports = loginValidator = [
    // body('email')
    //     .notEmpty()
    //     .withMessage('Please Provide a Email')
    //     .custom(async (email) => {
    //         let user = await UserModel.findOne({ email });
    //         if (!user) {
    //             return Promise.reject('Email Not  found');
    //         }
    //     }),
    // body('password')
    //     .notEmpty()
    //     .withMessage('Password is Required')
    //     .custom(async (password) => {
    //         let User = await UserModel.findOne({ password });
    //         if (User) {
    //             const match = await bcrypt.compare(password, User.password);
    //             if (!match) {
    //                 return Promise.reject('sad , welcome');
    //             }
    //             return Promise.reject('welcome');
    //         }
    //     }),
    body('email').notEmpty().withMessage('Please Provide a Email'),
    body('password').notEmpty().withMessage('Please Provide Your Password'),
];
