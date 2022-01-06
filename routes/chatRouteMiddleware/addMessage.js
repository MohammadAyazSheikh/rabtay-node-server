const Chat = require('../../models/chatModel');
const userChat = require('../../models/userChatModel');
const ObjectId = require('mongoose').Types.ObjectId;


const pushSecondUser = (req, res, next, chat) => {

    console.log(`in 2nd ${req.user.id} ${req.body.to} `)
    userChat.findOne({ userId: req.body.to })
        .then(uChat => {

            if (uChat) {
                uChat.chats.push({ chatId: chat._id });
                uChat.save()
                    .then(uChat => {

                        res.status(200)
                            .setHeader('Content-Type', 'application/json')
                            .json(chat);


                    }, err => next(err))
                    .catch(err => err)

            }
            else {

                let NewUserChat = new userChat({ userId: req.body.to });

                NewUserChat.save()
                    .then(newUserChat => {

                        newUserChat.chats.push({ chatId: chat._id });
                        newUserChat.save()
                            .then(uChat => {

                                res.status(200)
                                    .setHeader('Content-Type', 'application/json')
                                    .json(chat);

                            }, err => next(err))
                            .catch(err => err);

                    }, err => next(err))
                    .catch(err => err);
            }
        }, err => next(err))
        .catch(err => err);
}

const pushUserChat = (req, res, next, chat) => {

    userChat.findOne({ userId: req.user.id })
        .then(uChat => {

            if (uChat) {
              
                uChat.chats.push({ chatId: chat._id });
                uChat.save()
                    .then(uChat => {

                        //Pushing 2nd User Data 
                        pushSecondUser(req, res, next, chat);

                    }, err => next(err))
                    .catch(err => err)

            }
            else {

                let NewUserChat = new userChat({ userId: req.user.id });

                NewUserChat.save()
                    .then(newUserChat => {

                        newUserChat.chats.push({ chatId: chat._id });
                        newUserChat.save()
                            .then(uChat => {

                                pushSecondUser(req, res, next, chat);

                            }, err => next(err))
                            .catch(err => err);

                    }, err => next(err))
                    .catch(err => err);
            }
        }, err => next(err))
        .catch(err => err);
}



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

                        //----Adding New Chat to  User  Chat------
                        pushUserChat(req, res, next, chat);


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


/*

 const  pushUserChat = (userId, chatId) => {
    console.log(`push chat method =  ${userId} ${chatId}`)
    userChat.find({ userId: userId })
        .then(uChat => {
            if (uChat) {
                uChats.push({ chatId: chatId });
                newUserChat.save()
                    .then(uChat => {
                        console.log(uChat);
                    }, err => next(err))
                    .catch(err => err)

            }
            else {

                let NewUserChat = new userChat({ userId: userId });

                NewUserChat.save()
                    .then(newUserChat => {

                        newUserChat.chats.push({ chatId: chatId });
                        newUserChat.save()
                            .then(uChat => {
                                console.log(uChat);
                            }, err => next(err))
                            .catch(err => err);

                    }, err => next(err))
                    .catch(err => err);
            }
        }, err => next(err))
        .catch(err => err);
}

*/