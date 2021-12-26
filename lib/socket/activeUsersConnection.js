const activeUsers = require('../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;
const { pushUserInDb } = require('./activeUserHandlers/pushUserInDb')
const activeUsersConnection = (clientSocket, serverSocket) => {

    clientSocket.on("active", data => {

        pushUserInDb(clientSocket, serverSocket, data);
        

    });

}

module.exports.activeUsersConnection = activeUsersConnection;