const Flash = require('../utils/Flash');
const PostModel = require('../models/Post');
const User = require('../models/User');
const moment = require('moment');
const ProfileModel = require('../models/Profile');

function genDate(day) {
    let date = moment().subtract(day, 'days');
    return date.toDate();
}

function generateFilterObject(filter) {
    let filterObj = {};
    let order = 1;

    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt: genDate(7),
                },
            };
            order = -1;
            break;
        }
        case 'month': {
            filterObj = {
                createdAt: {
                    $gt: genDate(30),
                },
            };
            order = -1;
            break;
        }

        case 'all': {
            order = -1;
            break;
        }
    }
    console.log(filterObj);
    return {
        filterObj,
        order,
    };
}

exports.explorerController = async (req, res, next) => {
    let filter = req.query.filter || 'latest';
    let { order, filterObj } = generateFilterObject(filter.toLowerCase());
    // pagination
    let currentPage = parseInt(req.query.page) || 1;
    let itemPerPage = 10;

    try {
        const posts = await PostModel.find(filterObj)
            .populate({ path: 'author', model: User })
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);

        const totalPost = await PostModel.countDocuments();
        const totalPage = totalPost / itemPerPage;

        let bookmarks = [];
        if (req.user) {
            let profile = await ProfileModel.findOne({ user: req.user._id });
            if (profile) {
                bookmarks = profile.bookmarks;
            }
        }

        res.render('pages/explorer/explorer.ejs', {
            title: 'Explore All Post',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
            currentPage,
            itemPerPage,
            totalPage,
            bookmarks,
        });
    } catch (error) {
        next(error);
    }
};

exports.signlePostGetController = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const post = await PostModel.findById(postId)
            .populate({
                path: 'author',
                model: User,
                select: 'username profilePics',
            })
            .populate({
                path: 'comments',
                model: User,
                populate: {
                    path: 'user',
                    model: User,
                    select: 'username profilePics',
                },
            })
            .populate({
                path: 'comments',
                model: User,
                populate: {
                    path: 'replies.user',
                    model: User,
                    select: 'usename profilePics',
                },
            });

        if (!post) {
            next(error);
        }

        let bookmarks = [];
        if (req.user) {
            let profile = await ProfileModel.findOne({ user: req.user._id });
            if (profile) {
                let bookmarks = profile.bookmarks;
            }
        }

        res.render('pages/explorer/single-page.ejs', {
            title: post.title,
            flashMessage: Flash.getMessage(req),
            post,
            bookmarks,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
