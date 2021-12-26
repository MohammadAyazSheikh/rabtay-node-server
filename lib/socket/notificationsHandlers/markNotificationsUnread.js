const Notifications = require('../../../models/notificationModel');
const activeUsers = require('../../../models//activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;



const markNotificUnread = (_data, serverSocket, clientSocket) => {
    Notifications.updateMany({ to: new ObjectId(_data.id) }, { isRead: true }, { new: true })
        .then((notific) => {
            console.log(notific);
            Notifications.count({ to: new ObjectId(_data.id), isRead: false })
                .then((notific) => {

                    console.log(`count = ${notific}`);

                    activeUsers.findOne({ userId: new ObjectId(_data.id) })
                        .then(user => {

                            console.log(`\nln\nmarking unread notification of user =${user?.username} socketid = ${user?.socketId}`);

                            if (user?.isActive) {
                                serverSocket.to(user.socketId).emit('notification', { unreadNotific: notific });
                            }
                        });

                }, (err) => console.log(err))
                .catch((err) => console.log(err));


        }, (err) => console.log(err))
        .catch((err) => console.log(err));
}


module.exports = { markNotificUnread }