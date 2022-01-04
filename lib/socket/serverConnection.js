
const { Server } = require("socket.io");
const activeUsersConnection = require('./activeUsersConnection').activeUsersConnection;
const onClientDisconnect = require('./OnClientDisconnect').onClientDisconnect;
const notificationListener = require('./notificationListener').notificationListener;
const { pushUserInDb } = require('./activeUserHandlers/pushUserInDb');
// const activeUsers = require('../../models/activeUsers');




function socket(server) {

    const serverSocket = new Server(server);


    serverSocket.on('connection', (clientSocket) => {

        console.log(`a user connected \nsocket id =${clientSocket.id} `);


        console.log(clientSocket.handshake.auth);

        const data = clientSocket.handshake.auth;

        pushUserInDb(clientSocket, serverSocket, data)

        activeUsersConnection(clientSocket, serverSocket);

        onClientDisconnect(clientSocket, serverSocket);

        notificationListener(clientSocket, serverSocket);

    });





}

module.exports.socket = socket;