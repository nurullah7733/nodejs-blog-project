const UserModel = require('../models/User');

exports.bindUserWithRequest = () => {
    return async (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return next();
        }

        try {
            let user = await UserModel.findById(req.session.user._id);
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
};

exports.isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }

    next();
};

exports.authenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/dashboard');
    }

    next();
};
