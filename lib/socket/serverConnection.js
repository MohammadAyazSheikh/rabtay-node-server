
const { Server } = require("socket.io");
const activeUsersConnection = require('./activeUsersConnection').activeUsersConnection;
const onClientDisconnect = require('./OnClientDisconnect').onClientDisconnect;
// const activeUsers = require('../../models/activeUsers');




function socket(server) {

    const serverSocket = new Server(server);


    serverSocket.on('connection', (clientSocket) => {

        console.log('a user connected');
        console.log(clientSocket.id);

        activeUsersConnection(clientSocket, serverSocket);

        onClientDisconnect(clientSocket, serverSocket);

    });





}

module.exports.socket = socket;