var mongoose = require('mongoose');
const { Strategy } = require('passport');
var Schema = mongoose.Schema;

const commentSchema = new Schema({
    likes: {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const profileImage = new Schema({
    path: {
        type: String,
        default: '',
    },
    caption: {
        type: String,
        default: ''
    },
    // commentd: [commentSchema]
},
    {
        timestamps: true
    }
);

const User = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        hash: {
            type: String,
            required: true,
            unique: true
        },
        salt: {
            type: String,
            required: true,
            unique: true
        },
        fname: {
            type: String,
            default: ''
        },
        lname: {
            type: String,
            default: ''
        },
        dob: {
            type: Date
        },
        gender: {
            type: Boolean,
            default: true
        },
        profileImage: profileImage
    }
);

module.exports = mongoose.model('User', User);