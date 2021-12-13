
const { markNotificUnread } = require('../socket/notificationsHandlers/markNotificationsUnread');
const { pushNewNotific } = require('../socket/notificationsHandlers/pushNewNotification');



const notificationListener = (clientSocket, serverSocket) => {



    clientSocket.on('notification', (data) => {

        console.log(`notific payload = ${JSON.stringify(data)}`);




        if (data.markUnread) {

            markNotificUnread(data,serverSocket,clientSocket);
        }
        else {
            pushNewNotific(data,serverSocket,clientSocket);
        }
    });


}

module.exports.notificationListener = notificationListener;