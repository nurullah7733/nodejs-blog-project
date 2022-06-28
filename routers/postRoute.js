const postRouter = require('express').Router();
const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostGetController,
    myAllPostGetController,
} = require('../controllers/postController');
const postValidator = require('../validator/dashboard/post/postValidator');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

postRouter.get('/create', createPostGetController);
postRouter.post(
    '/create',
    isAuthenticated,
    upload.single('post-thumbnail'),
    postValidator,
    createPostPostController
);

postRouter.get('/edit/:postId', isAuthenticated, editPostGetController);
postRouter.post(
    '/edit/:postId',
    isAuthenticated,
    upload.single('post-thumbnail'),
    postValidator,
    editPostPostController
);

postRouter.get('/delete/:postId', isAuthenticated, deletePostGetController);
postRouter.get('/posts', isAuthenticated, myAllPostGetController);

module.exports = postRouter;
