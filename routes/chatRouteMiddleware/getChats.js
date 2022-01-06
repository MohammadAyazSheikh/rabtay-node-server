const Chat = require('../../models/chatModel');
const userChat = require('../../models/userChatModel');
const ObjectId = require('mongoose').Types.ObjectId;

const getChats = (req, res, next) => {



    userChat.aggregate([
        { $match: { userId: req.user._id } },
        // { $unwind: "$chats" },
        // { $project: { chatsId: "$chats.chatId", userId: 1 } },
        //   { $unwind: "$chatsId" },
    ])
        .then(chats => {

            // const chatsIdArray = chats[0].chatsId;
            // console.log(chatsIdArray);
            // Chat.find({ _id: { $in: chats[0].chatsId } })
            //     .then(chats => {
            //         console.log(chats);
            //         res.status(200)
            //             .setHeader('Content-Type', 'application/json')
            //             .json(chats);
            //     }, err => next(err))
            //     .then(err => next(err));



                res.status(200)
                .setHeader('Content-Type', 'application/json')
                .json(chats);


        },
            err => next(err))
        .catch(err => next(err));

}

module.exports = {
    getChats
}