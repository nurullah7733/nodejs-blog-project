const routes = require('express').Router();
const { isAuthenticated } = require('../../middleware/authMiddleware');
const {
    commentPostController,
    commentReplaysController,
} = require('../controllers/commentController');

const {
    likeGetController,
    disLikeGetController,
} = require('../controllers/likeDislikeController');

const { bookmarksController } = require('../controllers/bookmarksController');

routes.post('/comments/:postId', isAuthenticated, commentPostController);
routes.post(
    '/comments/replies/:commentId',
    isAuthenticated,
    commentReplaysController
);

routes.get('/likes/:postId', isAuthenticated, likeGetController);
routes.get('/dislikes/:postId', isAuthenticated, disLikeGetController);

routes.get('/bookmarks/:postId', isAuthenticated, bookmarksController);

module.exports = routes;
