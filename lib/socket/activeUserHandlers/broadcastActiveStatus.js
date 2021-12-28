
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
        { $unwind: "$ActiveContacts" },
        {
            $project: {
                contacts: 1,
                isActive: "$ActiveContacts.isActive",
                // lastSeen: "$ActiveContacts.updatedAt",
                socketId: "$ActiveContacts.socketId"
            }
        }
    ])
        .then(contacts_ => {

            contacts.populate(contacts_, { path: "contacts.contactId" })
                .then(_contacts => {


                    _contacts.forEach(Contact => {
                        if (Contact.isActive) {
                            const socketId = Contact.socketId;
                            const uid = Contact.contacts.contactId._id
                            serverSocket.to(socketId).emit('active', { userId: uid });
                        }
                    });

                }, err => next(err));



        }, err => next(err));
}





module.exports = {
    boradcastActiveStatus
}