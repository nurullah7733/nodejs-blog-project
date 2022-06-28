const { Schema, model } = require('mongoose');
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
            type: Schema.ObjectId,
            ref: 'UserModel',
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
                type: Schema.ObjectId,
                ref: 'UserModel',
            },
        ],
        dislikes: [
            {
                type: Schema.ObjectId,
                ref: 'UserModel',
            },
        ],
        comments: [
            {
                type: Schema.ObjectId,
                ref: 'CommentsModel',
            },
        ],
    },
    { timestamps: true }
);

const PostModel = model('posts', postSchema);

module.exports = PostModel;
