
const { Server } = require("socket.io");
const activeUsersConnection = require('./activeUsersConnection').activeUsersConnection;
const onClientDisconnect = require('./OnClientDisconnect').onClientDisconnect;
const notificationListener = require('./notificationListener').notificationListener;
const { chatListener } = require('./chatHandlers/chatListener');
const { chatStatusListener } = require('./chatHandlers/chatStatusListener');
const { pushUserInDb } = require('./activeUserHandlers/pushUserInDb');
const { typingListener } = require('./chatHandlers/typingListener');
const { videoCallListener } = require('./videoCallHandlers/videoCallListener')
// const activeUsers = require('../../models/activeUsers');

//typingListener


function socket(server) {

    const serverSocket = new Server(server);


    serverSocket.on('connection', (clientSocket) => {

        console.log(`a user connected \nsocket id =${clientSocket.id} `);


        console.log(clientSocket.handshake.auth);

        const data = clientSocket.handshake.auth;

        pushUserInDb(clientSocket, serverSocket, data);

        activeUsersConnection(clientSocket, serverSocket);

        onClientDisconnect(clientSocket, serverSocket);

        notificationListener(clientSocket, serverSocket);

        chatListener(clientSocket, serverSocket);

        chatStatusListener(clientSocket, serverSocket);

        typingListener(clientSocket, serverSocket);

        videoCallListener(clientSocket, serverSocket);

    });
}

module.exports.socket = socket;