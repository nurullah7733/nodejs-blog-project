const Flash = require('../utils/Flash');
const userModel = require('../models/User');
const ProfileModel = require('../models/Profile');
const PostModel = require('../models/Post');

module.exports = authorController = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const author = await userModel.findById(userId).populate({
            path: 'profile',
            model: ProfileModel,
        });

        console.log(author);
        res.render('pages/explorer/author.ejs', {
            title: 'Author Page',
            flashMessage: Flash.getMessage(req),
            author,
        });
    } catch (error) {
        next(error);
    }
};
