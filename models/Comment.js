const { Schema, model } = require('mongoose');
const PostModel = require('./Post');
const UserModel = require('./User');

const commentsSchema = Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'postModel',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'userModel',
            required: true,
        },
        body: {
            type: String,
            trim: true,
            required: true,
        },
        replies: [
            {
                body: {
                    type: String,
                    required: true,
                },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'userModel',
                    required: true,
                },
                createAt: {
                    type: Date,
                    default: new Date(),
                },
            },
        ],
    },
    { timestamps: true }
);

const CommentsModel = model('comments', commentsSchema);
module.exports = CommentsModel;
