const contacts = require('../../../models/contactsModel');
const chats = require('../../../models/chatModel');
const activeUsers = require('../../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;

const chatStatusListener = (clientSocket, serverSocket) => {


    clientSocket.on("chatStatus", data => {

        console.log('msg status change handler');

        const contactId = data.contactId;
        const chatId = data.chatId;

        //---update more than 1 elelement by using $[] operator--
        chats.updateMany(
            {
                _id: chatId,
                messages: { $elemMatch: { isSeen: false, from: contactId } }
            },
            {
                $set: {
                    "messages.$[].isSeen": true,
                    "messages.$[].isSent": false,
                    "messages.$[].isDelivered": false
                }
            } //$ is for posstion
        )
            .then(data => {

                activeUsers.findOne({ userId: new ObjectId(contactId) })
                    .then(user => {

                        console.log(`socket to send for status message \n${user.username} socketid = ${user.socketId}`);

                        if (user?.isActive) {
                            
                            serverSocket.to(user.socketId).emit('chatStatus', { status: 'seen' });
                        }
                    })
                    .catch((err) => console.log(err));

            }, err => next(err))
            .catch(err => { next(err) })



    });

}

module.exports.chatStatusListener = chatStatusListener;