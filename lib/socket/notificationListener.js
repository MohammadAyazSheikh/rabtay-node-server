const notifications = require('../../models/notificationModel');
const activeUsers = require('../../models/activeUsers');

const notificationListener = (clientSocket, serverSocket) => {



    clientSocket.on('notification', (data) => {

        const notific = new notifications(
            {
                from: data.from, to: data.to,
                isRead: false, description: data.description
            }
        );

        notific.save()
            .then((notific_) => {

                activeUsers.findOne({ userId: data.to })
                    .then(user => {
                        serverSocket.to(user.scoketId).emit('notification', { notifcation: DataCue });
                    })

            })
            .catch(err => { console.log(err) });
    });


}

module.exports.notificationListener = notificationListener;