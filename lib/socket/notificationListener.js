const Notifications = require('../../models/notificationModel');
const activeUsers = require('../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../models/users');


const notificationListener = (clientSocket, serverSocket) => {



    clientSocket.on('notification', (_data) => {

        const data = _data.payload;
        const notific = new Notifications(
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

                            console.log(`\n\ndata.to =  ${data.to}\n\n`)
                            Notifications.count({ to: new ObjectId(data.to), isRead: false })
                                .then((notific) => {

                                    console.log(`sending unread notifc count = ${notific} to user = ${user.username} from ${_data.senderName}`);

                                    serverSocket.to(user.socketId).emit('notification', { unreadNotific: notific });

                                }, (err) => next(err))
                                .catch((err) => next(err));


                        }

                    })

            })
            .catch(err => { console.log(err) });
    });


}

module.exports.notificationListener = notificationListener;