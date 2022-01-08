const Chat = require('../../models/chatModel');
const userChat = require('../../models/userChatModel');
const ObjectId = require('mongoose').Types.ObjectId;

const getChats = (req, res, next) => {



    userChat.aggregate([
        //getting  chats ids from userChat collection
        { $match: { userId: req.user._id } },
        //unwind chats array
        { $unwind: "$chats" },
        //projecting only chats id
        { $project: { chatsId: "$chats.chatId", _id: 0 } },
        //joining chats collection (getting all chats )
        {
            $lookup:
            {
                from: "chats",
                localField: "chatsId",
                foreignField: "_id",
                as: "chats"
            }
        },
        // removing users and messges from chats array result of lookup
        {
            $project: {
                users: "$chats.users",
                messages: "$chats.messages"
            }
        },
        //removing unnecessary  arrays brackets
        { $unwind: "$users" },
        { $unwind: "$messages" },
        //project only users & only 1st message of each chat
        {
            $project: {
                users: "$users.userId",
                messages: { $first: "$messages" },
            }
        },
    ])
        .then(chats => {

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