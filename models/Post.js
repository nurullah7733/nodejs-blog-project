const { Schema, model, Mongoose } = require('mongoose');
const UserModel = require('./User');
const CommentsModel = require('./Comment');

const postSchema = Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            maxLength: 100,
        },
        body: {
            type: String,
            required: true,
            maxLength: 5000,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'userModel',
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        thumbnail: String,
        readTime: String,
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: '',
            },
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'userModel',
            },
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'commentsModel',
            },
        ],
    },
    { timestamps: true }
);

postSchema.index(
    {
        title: 'text',
        body: 'text',
        tags: 'text',
    },
    {
        weights: {
            title: 5,
            tags: 5,
            body: 2,
        },
    }
);

const PostModel = model('posts', postSchema);

module.exports = PostModel;
