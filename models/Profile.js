const { Schema, model } = require('mongoose');
const UserModel = require('./User');
const PostModel = require('./Post');

const profileSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'userModel',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30,
    },
    title: {
        type: String,
        trim: true,
        maxLength: 100,
    },

    bio: {
        type: String,
        trim: true,
        maxLength: 500,
    },

    profilePic: String,

    links: {
        website: String,
        facebook: String,
        twitter: String,
        linkedin: String,
    },

    posts: [
        {
            type: Schema.ObjectId,
            ref: 'postModel',
        },
    ],

    bookmarks: [
        {
            type: Schema.ObjectId,
            ref: 'postModel',
        },
    ],
});

const ProfileModel = model('profiles', profileSchema);
module.exports = ProfileModel;
