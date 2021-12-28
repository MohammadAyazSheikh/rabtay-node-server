const activeUsers = require('../../models/activeUsers');
const { boradcastActiveStatus } = require('./activeUserHandlers/broadcastActiveStatus');

const onClientDisconnect = (clientSocket, serverSocket) => {



    clientSocket.on('disconnect', () => {

        console.log(`\n\ndisconnected socket id = ${clientSocket.id}`);

        activeUsers.findOne({ socketId: clientSocket.id })
            .then(user => {
                boradcastActiveStatus(clientSocket, serverSocket, user.userId);
            })

        activeUsers.findOneAndUpdate(
            { socketId: clientSocket.id },
            { isActive: false },
            { new: true }
        )
            .then(user => {
                console.log(`\n\nuser disconnects from db \n${JSON.stringify(user)}`);
                // console.log(`a user disconnects \nsokcet id = ${clientSocket.id} \nisActive = ${user.isActive} \nuserid = ${user.userId}`)
            })
            .catch(err => { console.log(err) });
    });


}

module.exports.onClientDisconnect = onClientDisconnect;