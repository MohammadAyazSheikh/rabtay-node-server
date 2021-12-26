const activeUsers = require('../../../models/activeUsers');
const contacts = require('../../../models/contactsModel');
const ObjectId = require('mongoose').Types.ObjectId;

const boradcastActiveStatus = (clientSocket, serverSocket, uId) => {

    contacts.aggregate([
        { $match: { userId: new ObjectId(uId) } },
        { $unwind: "$contacts" },
        {
            $lookup:
            {
                from: "activeusers",
                localField: "contacts.contactId",
                foreignField: "userId",
                as: "ActiveContacts"
            }
        },
        {
            $project: {
                userId: 1,
                isActive: "$ActiveContacts.isActive",
                lastSeen: "$ActiveContacts.updatedAt",
                socketId: "$ActiveContacts.socketId"
            }
        }
    ])
        .then(contacts_ => {

            contacts.populate(contacts_, { path: "contacts.contactId" })
                .then(_contacts => {


                    _contacts.forEach(Contact => {
                        const isActive = Contact.isActive[0];
                        const socketId = Contact.socketId[0];
                        const user = Contact.userId;
                        const data = { isActive, user }
                        serverSocket.to(socketId).emit('active', data);
                    })

                }, err => next(err));



        }, err => next(err));
}





module.exports = {
    boradcastActiveStatus
}