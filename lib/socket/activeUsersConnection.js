const activeUsers = require('../../models/activeUsers');

const activeUsersConnection = (clientSocket, serverSocket) => {

    clientSocket.on("active", data => {

        activeUsers.findOne({ userId: data.userId })
            .then(user => {

                if (user) {

                    activeUsers.findOneAndUpdate(
                        { userId: data.userId },
                        { socketId: clientSocket.id, isActive: true },
                        { new: true }
                    )
                        .then(user => {
                            serverSocket.emit("active", user);
                            console.log(`Acive user ${JSON.stringify(user)}`);
                        })
                        .catch(err => { console.log(err) });
                }
                else {

                    const user = new activeUsers({ userId: data.userId, socketId: clientSocket.id, isActive: true ,username:data.username});

                    user.save()
                        .then((user) => {

                            console.log(`Acive user ${JSON.stringify(user)}`);

                            activeUsers.find({ socketId: clientSocket.id })
                                .then(user => {
                                    serverSocket.emit("active", user);
                                })
                                .catch(err => { console.log(err) });

                        })
                        .catch(err => { console.log(err) });
                }
            })
            .catch(err => { console.log(err) });
    });

}

module.exports.activeUsersConnection = activeUsersConnection;