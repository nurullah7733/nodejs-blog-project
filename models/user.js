const { model, Schema } = require('mongoose');
const ProfileModel = require('./Profile');

const userSchema = Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            maxLength: 15,
        },

        email: {
            type: String,
            trim: true,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        profile: {
            type: Schema.ObjectId,
            ref: 'profileModel',
        },
        profilePics: {
            type: String,
            default: '/uploads/default.png',
        },
    },
    { versionKey: false, timestamps: true }
);

const userModel = model('users', userSchema);
module.exports = userModel;
