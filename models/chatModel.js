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
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        default: 'text',
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
        messages: [MessagesSchema]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Chat', Chat);