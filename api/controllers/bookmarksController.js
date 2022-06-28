const ProfileModel = require('../../models/Profile');

exports.bookmarksController = async (req, res) => {
    const { postId } = req.params;

    if (!req.user) {
        console.log('Your are not Authenticated');
        return res.status(400).json('Your are not Authenticated');
    }

    let bookmarked = null;

    try {
        const profile = await ProfileModel.findOne({ user: req.user._id });

        if (profile.bookmarks.includes(postId)) {
            await ProfileModel.findOneAndUpdate(
                { user: req.user._id },
                { $pull: { bookmarks: postId } }
            );
            bookmarked = false;
        } else {
            await ProfileModel.findOneAndUpdate(
                { user: req.user._id },
                { $push: { bookmarked: postId } }
            );
            bookmarked = true;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('server Error');
    }
};
