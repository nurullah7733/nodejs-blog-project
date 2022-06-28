const PostModel = require('../../models/Post');

exports.likeGetController = async (req, res, next) => {
    const { postId } = req.params;
    if (!req.user) {
        return res.status(400).json('Your are not Authenticated');
    }

    let liked = null;

    try {
        const post = await PostModel.findById(postId);

        if (post.dislikes.includes(req.user._id)) {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $pull: { dislikes: req.user._id } }
            );
        }

        if (post.likes.includes(req.user._id)) {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $pull: { likes: req.user._id } }
            );
            liked = false;
        } else {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $push: { likes: req.user._id } }
            );
            liked = true;
        }

        let updatedPost = await PostModel.findById(postId);
        res.status(200).json({
            liked,
            totalLikes: updatedPost.likes.length,
            totalDisLikes: updatedPost.dislikes.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json('server Error');
    }
};
exports.disLikeGetController = async (req, res, next) => {
    const { postId } = req.params;
    if (!req.user) {
        return res.status(400).json('Your are not Authenticated');
    }

    let disLiked = null;

    try {
        const post = await PostModel.findById(postId);

        if (post.likes.includes(req.user._id)) {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $pull: { likes: req.user._id } }
            );
        }

        if (post.dislikes.includes(req.user._id)) {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $pull: { dislikes: req.user._id } }
            );
            disLiked = false;
        } else {
            await PostModel.findOneAndUpdate(
                { _id: postId },
                { $push: { dislikes: req.user._id } }
            );
            disLiked = true;
        }

        let updatedPost = await PostModel.findById(postId);
        res.status(200).json({
            disLiked,
            totalLikes: updatedPost.likes.length,
            totalDisLikes: updatedPost.dislikes.length,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json('server Error');
    }
};
