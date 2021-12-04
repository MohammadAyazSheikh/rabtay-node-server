
const { Server } = require("socket.io");





function socket(server) {

    const serverSocket = new Server(server);

    var sockets = [];
    serverSocket.on('connection', (socket) => {
        console.log('a user connected');

        sockets.push(socket.id);

        console.log(socket.id);
        serverSocket.sockets.to(sockets[0]).emit("chat message", '\n\n\nsever send msgs:' + `id =${sockets[0]}\n\n`);
        // serverSocket.emit("chat message", '\n\n\nsever send msgs:' + `id =${sockets[0]}\n\n`);
        // socket.on("chat message", msg => {
        //   console.log(msg);
        //   io.emit("chat message", 'sever send msgs');
        // });
    });


}

module.exports.socket = socket;