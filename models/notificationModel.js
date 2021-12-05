var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const notification = new Schema(
    {
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: ''
        },
        description: {
            type: String,
            required: true,
            default: ''
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('notifications', notification);