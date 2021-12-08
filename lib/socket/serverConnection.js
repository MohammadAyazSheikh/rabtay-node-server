
const { Server } = require("socket.io");
const activeUsersConnection = require('./activeUsersConnection').activeUsersConnection;
const onClientDisconnect = require('./OnClientDisconnect').onClientDisconnect;
const notificationListener = require('./notificationListener').notificationListener;
// const activeUsers = require('../../models/activeUsers');




function socket(server) {

    const serverSocket = new Server(server);


    serverSocket.on('connection', (clientSocket) => {

        console.log(`a user connected \nsocket id =${clientSocket.id} `);
       

        activeUsersConnection(clientSocket, serverSocket);

        onClientDisconnect(clientSocket, serverSocket);

        notificationListener(clientSocket, serverSocket)

    });





}

module.exports.socket = socket;