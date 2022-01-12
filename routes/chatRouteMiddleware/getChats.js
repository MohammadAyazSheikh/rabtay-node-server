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
                chatId: "$chatsId",
                users: "$chats.users",
                messages: "$chats.messages",

            }
        },
        // //removing unnecessary  arrays brackets
        { $unwind: "$users" },
        { $unwind: "$messages" },
        { $unwind: "$users" },
        //removing own uId we need only friend id
        { $match: { "users.userId": { $ne: new ObjectId(req.user.id) } } },
        // project only users & only 1st message of each chat
        {
            $project: {
                chatId: 1,
                // users: "$users.userId",
                contactId: "$users.userId",
                message: { $last: "$messages" }, //getting 1st element of array
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

const getSingleChat = (req, res, next) => {


    // res.status(200).send(req.params.chatId);


    Chat.aggregate([
        { $match: { _id: new ObjectId(req.params.chatId) } },
        { $unwind: "$users" },
        { $match: { "users.userId": { $eq: new ObjectId(req.user.id) } } },
        {
            $project: {
                userId: "$users.userId",
                isTyping: "$users.isTyping",
                messages: 1,
            }
        },
      
    ])
        .then(chat => {
            res.status(200)
                .setHeader('Content-Type', 'application/json')
                .json(chat[0]);
        },
            err => next(err))
        .catch(err => next(err));

}

module.exports = {
    getChats,
    getSingleChat
}