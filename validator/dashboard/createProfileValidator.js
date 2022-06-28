const { body } = require('express-validator');
const validator = require('validator');

module.exports = [
    body('name').not().isEmpty().withMessage('Name Can not Be Empty'),

    body('title').not().isEmpty().withMessage('Title Can Not Be Empty'),

    body('bio').not().isEmpty().withMessage('Bio Can Not Be Empty'),

    body('facebook').custom((value) => {
        if (value) {
            if (!validator.isURL(value)) {
                throw new Error('Please Provide A Valid URL');
            }
        }

        return true;
    }),
    body('website').custom((value) => {
        if (value) {
            if (!validator.isURL(value)) {
                throw new Error('Please Provide A Valid URL');
            }
        }

        return true;
    }),
    body('twitter').custom((value) => {
        if (value) {
            if (!validator.isURL(value)) {
                throw new Error('Please Provide A Valid URL');
            }
        }

        return true;
    }),
    body('linkedin').custom((value) => {
        if (value) {
            if (!validator.isURL(value)) {
                throw new Error('Please Provide A Valid URL');
            }
        }

        return true;
    }),
];
