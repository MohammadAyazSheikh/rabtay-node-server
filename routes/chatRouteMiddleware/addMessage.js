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

                chat.users.push({ userId: req.user.id });
                chat.users.push({ userId: req.body.to });

                chat
                    .save()
                    .then(chat => {

                        //--------------Adding New Chat to  User 1 Chat---------------- 
                        let NewUserChat = new userChat({ userId: req.user.id });
                        NewUserChat.save()
                            .then(newUserChat => {
                                newUserChat.chats.push({ chatId: chat._id });
                                newUserChat.save()
                                    .then(uChat => {

                                        //  //--------------Adding New Chat to  User 2 Chat---------------- 

                                        let _NewUserChat = new userChat({ userId: req.body.to });
                                        _NewUserChat.save()
                                            .then(_newUserChat => {
                                                _newUserChat.chats.push({ chatId: chat._id });
                                                _newUserChat.save()
                                                    .then(_uChat => {

                                                        res
                                                            .status(200)
                                                            .setHeader('Content-Type', 'application/json')
                                                            .json(chat);

                                                    }, err => next(err))
                                                    .catch(err => next(err));
                                            }, err => next(err))
                                            .catch(err => next(err));


                                    }, err => next(err))
                                    .catch(err => next(err));
                            }, err => next(err))
                            .catch(err => next(err));
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