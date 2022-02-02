const activeUsers = require('../../../models/activeUsers');
const Users = require('../../../models/users');
const ObjectId = require('mongoose').Types.ObjectId;

const videoCallListener = (clientSocket, serverSocket) => {


    clientSocket.on("videoCall", data => {

        const contactId = data?.contactId;
        const roomName = data?.roomName;
        const userId = data?.userId;
        const startCall = data?.startCall;


        console.log(`\n\nVideo Call listener data = \n${JSON.stringify(data)}\n\n`);



        activeUsers.findOne({ userId: new ObjectId(contactId) })
            .then(user => {
                console.log(`socket to send message \n${user.username} socketid = ${user.socketId}`);

                if (startCall) {
                    if (user?.isActive && !user?.onCall) {

                        Users.findById(userId)
                            .then(_user => {
                                serverSocket.to(user.socketId).emit('videoCall', { startCall: true, roomName: roomName, contact: _user });
                            })
                            .catch(err => { console.log(err) });
                    }
                }
                else {
                    serverSocket.to(user.socketId).emit('videoCall', { startCall: false });
                }

            })
            .catch((err) => console.log(err));
    });

}

module.exports.videoCallListener = videoCallListener;