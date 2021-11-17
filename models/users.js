var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
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
        }
    }
);

module.exports = mongoose.model('User', User);