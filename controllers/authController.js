const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Flash = require('../utils/Flash');

const ErrorValidator = require('../utils/ErrorValidator');

exports.SignupGetController = (req, res) => {
    res.render('pages/auth/signup', {
        title: 'Sign-Up',
        errors: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};

exports.SignupPostController = async (req, res, next) => {
    const { username, email, password } = req.body;
    let errors = validationResult(req).formatWith(ErrorValidator);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Sign Up fail please try again');
        return res.render('pages/auth/signup', {
            title: 'Sign-Up',
            errors: errors.mapped(),
            value: { username, email, password },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 11);
        const user = new UserModel({
            username,
            email,
            password: hashPassword,
        });

        await user.save();
        req.flash('success', 'Account Create successfully!');
        res.redirect('/auth/login');
    } catch (error) {
        next(e);
    }
};
exports.LoginGetController = (req, res) => {
    console.log(req.user);
    res.render('pages/auth/login', {
        title: 'Login to your account',
        errors: {},
        value: {},
        flashMessage: Flash.getMessage(req),
    });
};
exports.LoginPostController = async (req, res) => {
    const { email, password } = req.body;

    let errors = validationResult(req).formatWith(ErrorValidator);

    if (!errors.isEmpty()) {
        return res.render('pages/auth/login', {
            title: 'Login to your account',
            errors: errors.mapped(),
            value: { email },
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            req.flash('fail', ' Please Provide Valid Credentials');
            return res.render('pages/auth/login', {
                title: 'Login to your account',
                errors: {},
                value: { email },
                flashMessage: Flash.getMessage(req),
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('fail', ' Please Provide Valid Credentials');
            return res.render('pages/auth/login', {
                title: 'Login to your account',
                errors: errors.mapped(),
                value: { email },
                flashMessage: Flash.getMessage(req),
            });
        }

        // session store database
        (req.session.isLoggedIn = true), (req.session.user = user);
        req.session.save((err) => {
            if (err) {
                return console.log(err);
            }
            req.flash('success', ' Successfully Logged In');
            return res.redirect('/dashboard');
        });
    } catch (error) {
        next(e);
    }
};

exports.LogoutController = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return next(e);
        }
        return res.redirect('/auth/login');
    });
};
