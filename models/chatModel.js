var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    text: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: null
    },
    isSent: {
        type: Boolean,
        default: false
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    isSeen: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});



const Chat = new Schema(
    {
        message: [MessagesSchema]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', User);