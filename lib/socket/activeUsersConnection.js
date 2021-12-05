const activeUsers = require('../../models/activeUsers');

const activeUsersConnection = (clientSocket,serverSocket) => {

    clientSocket.on("active", data => {

        activeUsers.find({ userId: data.userId })
            .then(user => {
                if (user) {
                    activeUsers.findOneAndUpdate(
                        { userId: data.userId },
                        { socketId: clientSocket.id, isActive: true },
                        { new: true }
                    )
                        .then(user => {
                            serverSocket.emit("active", user);
                        })
                        .catch(err => { console.log(err) });
                }
                else {

                    const user = new activeUsers({ userId: data.userId, socketId: clientSocket.id, isActive: true });

                    user.save()
                        .then((user) => {
                            console.log(user);


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