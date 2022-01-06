var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const _chats = new Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Chat'
        }
    },
    {
        timestamps: true
    }
);



const userChat = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        chats: [_chats]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('userChats', userChat);