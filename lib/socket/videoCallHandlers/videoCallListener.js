const activeUsers = require('../../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;

const videoCallListener = (clientSocket, serverSocket) => {


    clientSocket.on("videoCall", data => {

        const contactId = data.contactId;
        const roomName = data.roomName;


        console.log(`\n\nVideo Call listener data = \n${JSON.stringify(data)}\n\n`)

        activeUsers.findOne({ userId: new ObjectId(contactId) })
            .populate('userId')
            .then(user => {
                console.log(JSON.stringify(user.userId))
                console.log(`socket to send message \n${user.username} socketid = ${user.socketId}`);

                if (user?.isActive && !user?.onCall) {
                    serverSocket.to(user.socketId).emit('videoCall', { startCall: true, roomName: roomName });
                }
            })
            .catch((err) => console.log(err));
    });

}

module.exports.videoCallListener = videoCallListener;