const activeUsers = require('../../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;
const { boradcastActiveStatus } = require('./broadcastActiveStatus');

const pushUserInDb = (clientSocket, serverSocket, data) => {

    activeUsers.findOne({ userId: new ObjectId(data.userId) })
        .then(user => {

            if (user) {

                activeUsers.findOneAndUpdate(
                    { userId: new ObjectId(data.userId) },
                    { socketId: clientSocket.id, isActive: true },
                    { new: true }
                )
                    .then(user => {
                        // serverSocket.emit("active", user);
                        console.log(`Acive user ${JSON.stringify(user)}`);
                    })
                    .catch(err => { console.log(err) });
            }
            else {

                const user = new activeUsers({ userId: data.userId, socketId: clientSocket.id, isActive: true, username: data.username });

                user.save()
                    .then((user) => {

                        console.log(`Acive user ${JSON.stringify(user)}`);

                        activeUsers.find({ socketId: clientSocket.id })
                            .then(user => {
                                // serverSocket.emit("active", user);
                            })
                            .catch(err => { console.log(err) });

                    })
                    .catch(err => { console.log(err) });
            }
            boradcastActiveStatus(clientSocket, serverSocket, data.userId);

        })
        .catch(err => { console.log(err) });
}

module.exports = {
    pushUserInDb
}