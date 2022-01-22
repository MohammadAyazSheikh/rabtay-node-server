const activeUsers = require('../../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;

const typingListener = (clientSocket, serverSocket) => {


    clientSocket.on("typing", data => {

        const contactId = data.contactId;
        const isTyping = data.isTyping;


        console.log(`\n\nTyping listener data = \n${JSON.stringify(data)}\n\n`)

        activeUsers.findOne({ userId: new ObjectId(contactId) })
            .then(user => {

                console.log(`socket to send message \n${user.username} socketid = ${user.socketId}`);

                if (user?.isActive) {
                    serverSocket.to(user.socketId).emit('typing', { isTyping: isTyping });
                }
            })
            .catch((err) => console.log(err));


    });

}

module.exports.typingListener = typingListener;