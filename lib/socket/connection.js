
const { Server } = require("socket.io");
const activeUsersConnection = require('./activeUsersConnection').activeUsersConnection;
// const activeUsers = require('../../models/activeUsers');




function socket(server) {

    const serverSocket = new Server(server);


    serverSocket.on('connection', (clientSocket) => {

        console.log('a user connected');
        console.log(clientSocket.id);

        activeUsersConnection(clientSocket,serverSocket);



        clientSocket.on('disconnect', () => {
            console.log(`User Disconnect: ${clientSocket.id}`)

        });

    });





}

module.exports.socket = socket;