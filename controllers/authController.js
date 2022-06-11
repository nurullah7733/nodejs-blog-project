const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const ErrorValidator = require('../utils/ErrorValidator');

exports.SignupGetController = (req, res) => {
    console.log(req.session.isLoggedIn);
    res.render('pages/auth/signup', {
        title: 'Sign-Up',
        errors: {},
        value: {},
    });
};

exports.SignupPostController = async (req, res) => {
    const { username, email, password } = req.body;
    let errors = validationResult(req).formatWith(ErrorValidator);
    if (!errors.isEmpty()) {
        // console.log(errors.mapped());
        return res.render('pages/auth/signup', {
            title: 'Sign-Up',
            errors: errors.mapped(),
            value: { username, email, password },
        });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 11);
        const user = new UserModel({
            username,
            email,
            password: hashPassword,
        });

        const userCreate = await user.save();
        console.log('data success', userCreate);
        res.render('pages/auth/signup', {
            title: 'Sign Up ',
            errors: {},
            value: {},
        });
    } catch (error) {
        console.log(error);
    }
};
exports.LoginGetController = (req, res) => {
    console.log(req.user);
    res.render('pages/auth/login', {
        title: 'Login to your account',
        errors: {},
        value: {},
    });
};
exports.LoginPostController = async (req, res) => {
    const { email, password } = req.body;

    let errors = validationResult(req).formatWith(ErrorValidator);
    if (!errors.isEmpty()) {
        // return console.log(errors.mapped());
        return res.render('pages/auth/login', {
            title: 'Login to your account',
            errors: errors.mapped(),
            value: { email },
        });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ message: 'User Not fount' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.json({ message: 'invalid crediencials' });
        }

        // session store database
        (req.session.isLoggedIn = true), (req.session.user = user);
        req.session.save((err) => {
            if (err) {
                return console.log(err);
            }
            return res.redirect('/dashboard');
        });
    } catch (error) {
        console.log(error);
    }
};

exports.LogoutController = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        return res.redirect('/auth/login');
    });
};
