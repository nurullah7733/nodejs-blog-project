const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');

const { validationResult } = require('express-validator');
const ErrorValidator = require('../utils/ErrorValidator');
const userModel = require('../models/User');
const PostModel = require('../models/Post');
const CommentsModel = require('../models/Comment');

exports.dashboardController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
            .populate({
                path: 'posts',
                model: PostModel,
                select: '-_id title thumbnail',
            })
            .populate({
                path: 'bookmarks',
                model: PostModel,
                select: '-_id title thumbnail',
            });

        // res.json(profile);

        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: 'dashboard',
                flashMessage: Flash.getMessage(req),
                posts: profile.posts.reverse().slice(0, 3),
                bookmarks: profile.bookmarks.reverse().slice(0, 3),
            });
        }
        res.redirect('/dashboard/create-profile');
    } catch (error) {
        next(error);
    }
};

exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id });
        if (profile) {
            return res.redirect('/dashboard/edit-profile');
        }
        res.render('pages/dashboard/create-profile', {
            title: 'create your profile',
            flashMessage: Flash.getMessage(req),
            errors: {},
        });
    } catch (e) {
        next(e);
    }
};

exports.createProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(ErrorValidator);

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', {
            title: 'create your profile',
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req),
        });
    }

    let { name, title, bio, facebook, twitter, linkedin, website } = req.body;
    try {
        const Profiles = await Profile.create({
            name,
            title,
            bio,
            user: req.user._id,
            profilePic: req.user.profilePic,
            links: {
                facebook: facebook || '',
                twitter: twitter || '',
                linkedin: linkedin || '',
                website: website || '',
            },
            posts: [],
            bookmarks: [],
        });

        await userModel.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: Profiles._id } }
        );
        req.flash('success', 'Profile Create Success!');
        res.redirect('/dashboard');
    } catch (error) {
        next(error);
    }
};

exports.editProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });

        if (!profile) {
            return res.redirect('/dashboard/create-profile');
        }
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Profile',
            errors: {},
            profile,
            flashMessage: Flash.getMessage(req),
        });
    } catch (error) {
        console.log(error);
        next();
    }
};
exports.editProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(ErrorValidator);
    let { name, title, bio, facebook, twitter, linkedin, website } = req.body;
    let profile = Profile.findOne({ user: req.user_id });

    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/edit-profile', {
            title: 'Edit your profile',
            errors: errors.mapped(),
            profile,
            flashMessage: Flash.getMessage(req),
        });
    }

    try {
        let profile = {
            name,
            title,
            bio,

            links: {
                facebook: facebook || '',
                twitter: twitter || '',
                linkedin: linkedin || '',
                website: website || '',
            },
        };
        let updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profile },
            { new: true }
        );
        req.flash('success', 'Profile Update Success!');
        return res.render('pages/dashboard/edit-profile', {
            title: 'Edit your profile',
            errors: {},
            profile: updatedProfile,
            flashMessage: Flash.getMessage(req),
        });
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.bookmarksGetController = async (req, res, next) => {
    const profile = await Profile.findOne(req.user._id).populate({
        path: 'bookmarks',
        model: PostModel,
    });

    console.log(profile.posts);

    res.render('pages/dashboard/bookmarks', {
        title: 'Bookmark Posts',
        flashMessage: Flash.getMessage(req),
        profile,
    });
};

exports.commentGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user._id });
        const comments = await CommentsModel.find({
            post: { $in: profile.posts },
        })
            .populate({
                path: 'post',
                model: PostModel,
                select: 'title',
            })
            .populate({
                path: 'user',
                model: userModel,
                select: 'username profilePics',
            })
            .populate({
                path: 'replies.user',
                model: userModel,
                select: 'username profilePics',
            });

        res.render('pages/dashboard/comments', {
            title: 'My Comments',
            flashMessage: Flash.getMessage(req),
            comments,
        });
    } catch (error) {
        next(error);
    }
};
