const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
    uploadProfilePics,
    removeProfilePics,
    postImageUploadController,
} = require('../controllers/uploadController');
const upload = require('../middleware/uploadMiddleware');

router.post(
    '/profilePics',
    isAuthenticated,
    upload.single('profilePics'),
    uploadProfilePics
);
router.delete('/profilePics', isAuthenticated, removeProfilePics);
router.post(
    '/postimage',
    isAuthenticated,
    upload.single('post-image'),
    postImageUploadController
);

module.exports = router;
