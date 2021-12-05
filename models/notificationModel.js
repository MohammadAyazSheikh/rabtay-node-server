var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const notifications = new Schema(
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
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('notifications', notifications);