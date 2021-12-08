var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const notifications = new Schema(
    {
        from: {
            // type: String,
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User'
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