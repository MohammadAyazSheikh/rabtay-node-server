const contacts = require('../../models/contactsModel');
const notification = require('../../models/notificationModel');
const activeUsers = require('../../models/activeUsers');
const ObjectId = require('mongoose').Types.ObjectId;


const getContacts = (req, res, next) => {


    contacts.aggregate([
        { $match: { userId: new ObjectId(req.user.id) } },
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
                contacts: 1,
                isActive: "$ActiveContacts.isActive",
                lastSeen: "$ActiveContacts.updatedAt"

            }
        }
    ])
        .then(contacts_ => {

            contacts.populate(contacts_, { path: "contacts.contactId" })
                .then(_contacts => {

                    res
                        .status(200)
                        .setHeader('Content-Type', 'application/json')
                        .json(_contacts)

                }, err => next(err));

        }, err => next(err));

}

module.exports = {
    getContacts
}