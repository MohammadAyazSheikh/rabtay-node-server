const activeUsers = require('../../models/activeUsers');

const onClientDisconnect = (clientSocket, serverSocket) => {



    clientSocket.on('disconnect', () => {

        activeUsers.findOneAndUpdate(
            { socketId: clientSocket.id },
            { isActive: false },
            { new: true }
        )
            .then(user => {
                console.log(`\n\n user disconnects \n\n\n${JSON.stringify(user)}`);
                // console.log(`a user disconnects \nsokcet id = ${clientSocket.id} \nisActive = ${user.isActive} \nuserid = ${user.userId}`)
            })
            .catch(err => { console.log(err) });
    });


}

module.exports.onClientDisconnect = onClientDisconnect;