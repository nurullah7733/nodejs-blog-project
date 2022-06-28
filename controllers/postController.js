const Flash = require('../utils/Flash');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/ErrorValidator');
const readingTime = require('reading-time');
const Post = require('../models/Post');
const ProfileModel = require('../models/Profile');

exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/create-post', {
        title: 'Create Post',
        errors: {},
        flashMessage: Flash.getMessage(req),
        value: {},
    });
};

exports.createPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body;

    const errors = validationResult(req).formatWith(errorFormatter);

    if (!errors.isEmpty()) {
        res.render('pages/dashboard/post/create-post', {
            title: 'Create Post',
            errors: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            value: {
                title: title,
                body: body,
                tags: tags,
            },
        });
    }
    if (tags) {
        tags = tags.split(',');
    }

    let readTime = readingTime(body).text;

    const post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: [],
    });

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        const createPost = await post.save();
        await ProfileModel.findOneAndUpdate(
            { user: req.user._id },
            { $push: { posts: createPost._id } }
        );
        req.flash('success', 'Post Create Succes!');
        return res.redirect(`/post/edit/${createPost._id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.editPostGetController = async (req, res, next) => {
    const postId = req.params.postId;

    const post = await Post.findOne({ author: req.user._id, _id: postId });

    try {
        if (!post) {
            const errors = new Error('404 Not Found');
            errors.status = 400;
            console.log('post not found');
            throw errors;
        }

        res.render('pages/dashboard/post/edit-post', {
            title: 'Edit Post',
            errors: {},
            flashMessage: Flash.getMessage(req),
            post,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.editPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body;
    const errors = validationResult(req).formatWith(errorFormatter);
    const postId = req.params.postId;

    const post = await Post.findOne({ author: req.user._id, _id: postId });

    try {
        if (!post) {
            const errors = new Error('404 Not Found');
            errors.status = 400;
            console.log('post not found');
            throw errors;
        }

        if (!errors.isEmpty()) {
            res.render('pages/dashboard/post/edit-post', {
                title: 'Edit Post',
                errors: errors.mapped(),
                flashMessage: Flash.getMessage(req),
                post,
            });
        }

        if (tags) {
            tags = tags.split(',');
            tags = tags.map((t) => t.trim());
        }

        let thumbnail = post.thumbnail;
        if (req.file) {
            thumbnail = req.file.filename;
        }

        await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: { title, body, tags, thumbnail } },
            { new: true }
        );

        req.flash('success', 'Post Update Success');
        res.redirect('/');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.deletePostGetController = async (req, res, next) => {
    const { postId } = req.params;

    try {
        const post = await Post.findOne({ author: req.user._id, _id: postId });

        if (!post) {
            const errors = new Error('404 Not Found');
            errors.status = 400;
            console.log('post not found');
            throw errors;
        }

        await Post.findOneAndDelete({ _id: postId });
        await ProfileModel.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { posts: postId } }
        );
        req.flash('success', 'Post Delete Success');
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

exports.myAllPostGetController = async (req, res, next) => {
    const posts = await Post.find({ author: req.user._id });

    try {
        res.render('pages/dashboard/post/posts', {
            title: 'My All Posts',
            posts,
            flashMessage: Flash.getMessage(req),
        });
    } catch (error) {
        next(error);
    }
};
