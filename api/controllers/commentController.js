const CommentsModel = require('../../models/Comment');
const PostModel = require('../../models/Post');
const userModel = require('../../models/User');
// const UserModel = require('../../models/User');

exports.commentPostController = async (req, res, next) => {
    const { postId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        console.log('Your are not Authenticated');
        return res.status(403).json({ error: 'Your are not Authenticated' });
    }

    const createComments = await CommentsModel.create({
        post: postId,
        user: req.user._id,
        body: body,
        replies: [],
    });

    await PostModel.findOneAndUpdate(
        // { author: req.user._id }, test eta kaj korche ki na
        { _id: postId },
        { $push: { comments: createComments._id } }
    );

    try {
        const commentJson = await CommentsModel.findById(
            createComments._id
        ).populate({
            path: 'user',
            model: userModel,
            select: 'profilePics username',
        });
        res.status(201).json(commentJson);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.commentReplaysController = async (req, res, next) => {
    const { commentId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        console.log('Your are not Authenticated');
        return res.status(403).json({ error: 'Your are not Authenticated' });
    }

    const reply = { body, user: req.user };

    try {
        await CommentsModel.findOneAndUpdate(
            { _id: commentId },
            { $push: { replies: reply } }
        );
        res.status(200).json({
            ...reply,
            profilePics: req.user.profilePics,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json('server Error');
    }
};
