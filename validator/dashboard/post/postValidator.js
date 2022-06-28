const { body } = require('express-validator');
const cheerio = require('cheerio');

const postValidator = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title Can not be Empty')
        .isLength({ max: 100 })
        .withMessage('Title Can not be Greater Than 100 Chars')
        .trim(),
    body('body')
        .not()
        .isEmpty()
        .withMessage('Body Can not be Empty')
        .custom((value) => {
            const $ = cheerio.load(value);
            const text = $.text();

            if (text > 5000) {
                throw new Error('Body Can not be Greater Than 5000 Chars');
            }
            return true;
        }),
    body('tags').not().isEmpty().withMessage('Tags Can not be Empty').trim(),
];

module.exports = postValidator;
