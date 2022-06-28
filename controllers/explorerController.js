const Flash = require('../utils/Flash');
const PostModel = require('../models/Post');
const moment = require('moment');

function getDate(day) {
    let date = moment().subtract(day, 'days');
    return date.toDate();
}

exports.explorerController = async (req, res, next) => {
    let filter = req.query.filter || 'latest';

    try {
        const posts = await PostModel.find();

        res.render('pages/explorer/explorer.ejs', {
            title: 'Explore All Post',
            filter,
            flashMessage: Flash.getMessage(req),
            posts,
        });
    } catch (error) {
        next(error);
    }
};
