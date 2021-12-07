const notifications = require('../../models/notificationModel');
const activeUsers = require('../../models/activeUsers');
const User = require('../../models/users');


const notificationListener = (clientSocket, serverSocket) => {



    clientSocket.on('notification', (_data) => {

        const data = _data.payload;
        const notific = new notifications(
            {
                from: data.from, to: data.to, type: data.type,
                isRead: false, description: data.description
            }
        );

        notific.save()
            .then((notific_) => {

                activeUsers.findOne({ userId: data.to })
                    .then(user => {

                        console.log(`socket to send \n${user.username} socketid = ${user.socketId}`);

                        if (user?.isActive) {
                            User.findById({ _id: user.userId })
                                .then(data => {

                                    console.log(`\n\n\n\n sending notification to user \n${JSON.stringify(data)}`);
                                    serverSocket.to(user.socketId).emit('notification', `${_data.senderName} wnats to be your friend`);
                                    // clientSocket.broadcast.emit('notification', `${data.fname} ${data.lname} wnats to be your friend`);
                                })
                        }

                    })

            })
            .catch(err => { console.log(err) });
    });


}

module.exports.notificationListener = notificationListener;