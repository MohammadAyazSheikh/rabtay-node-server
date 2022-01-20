const contacts = require('../../../models/contactsModel');
const activeUsers = require('../../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;

const chatListener = (clientSocket, serverSocket) => {


    clientSocket.on("chat", data => {

        const contactId = data.contactId;
        const message = data.message;
        const chatId = data.chatId;

        console.log(`\n\nchat listener data = \n${JSON.stringify(data)}\n\n`)

        activeUsers.findOne({ userId: new ObjectId(contactId) })
            .then(user => {

                console.log(`socket to send message \n${user.username} socketid = ${user.socketId}`);

                if (user?.isActive) {
                    serverSocket.to(user.socketId).emit('chat', { message: message.message, chatId: chatId });
                }
            })
            .catch((err) => console.log(err));


    });

}

module.exports.chatListener = chatListener;