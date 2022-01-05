const Chat = require('../../models/chatModel');
const userChat = require('../../models/userChatModel');
const ObjectId = require('mongoose').Types.ObjectId;

const addMessage = (req, res, next) => {

    //if chat doesnt chat exist
    if (req.body.initializeChat) {

        const newChat = new Chat({});

        newChat.save()
            .then((chat) => {
                chat.messages.push(
                    {
                        text: req.body.text,
                        to: req.body.to,
                        from: req.user.id,
                        type: req.body.type,
                        isSent: true,
                        isDelivered: false,
                        isSeen: false
                    }
                );

                chat
                    .save()
                    .then(chat => {
                        res
                            .status(200)
                            .setHeader('Content-Type', 'application/json')
                            .json(chat);

                    })
            }, err => next(err))
            .catch((err) => {
                next(err);
            });

    }
    else {

        Chat.findOne({ _id: new ObjectId(req.body.chatId) })
            .then(chat => {


                chat.messages.push(
                    {
                        text: req.body.text,
                        to: req.body.to,
                        from: req.user.id,
                        type: req.body.type,
                        isSent: true,
                        isDelivered: false,
                        isSeen: false
                    }
                );

                chat
                    .save()
                    .then(chat => {
                        res
                            .status(200)
                            .setHeader('Content-Type', 'application/json')
                            .json(chat);

                    })
            }, err => next(err))
            .catch((err) => {
                next(err);
            });
    }

}

module.exports = {
    addMessage
}