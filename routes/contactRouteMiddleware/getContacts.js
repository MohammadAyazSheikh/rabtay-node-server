const contacts = require('../../models/contactsModel');
const ObjectId = require('mongoose').Types.ObjectId;



const getContacts = (req, res, next) => {
    console.log(req.params.userId);

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
        { $unwind: "$ActiveContacts" },
        {
            $project: {

                // contact: "$contacts.contactId",
                // userId: 1,
                // ActiveContacts:1,
                contacts: 1,
                isActive: "$ActiveContacts.isActive",
                lastSeen: "$ActiveContacts.updatedAt",
                socketId: "$ActiveContacts.socketId",
            }
        },
        { $sort: { isActive: -1 } },
    ])
        .then(contacts_ => {

            contacts.populate(contacts_, { path: "contacts.contactId" })
                .then(_contacts => {

                    let cont = _contacts.map(_cont => {

                        _cont.isFriend = true;

                        return _cont;
                    });

                    res
                        .status(200)
                        .setHeader('Content-Type', 'application/json')
                        .json(cont)

                }, err => next(err));


        }, err => next(err));

}

module.exports = {
    getContacts
}
























// const contacts = require('../../models/contactsModel');
// const ObjectId = require('mongoose').Types.ObjectId;



// const getContacts = (req, res, next) => {


//     contacts.aggregate([
//         { $match: { userId: new ObjectId(req.user.id) } },
//         { $unwind: "$contacts" },
//         {
//             $lookup:
//             {
//                 from: "activeusers",
//                 localField: "contacts.contactId",
//                 foreignField: "userId",
//                 as: "ActiveContacts"
//             }
//         },
//         { $unwind: "$ActiveContacts" },
//         {
//             $project: {

//                 // contact: "$contacts.contactId",
//                 // userId: 1,
//                 // ActiveContacts:1,
//                 contacts: 1,
//                 isActive: "$ActiveContacts.isActive",
//                 lastSeen: "$ActiveContacts.updatedAt",
//                 socketId: "$ActiveContacts.socketId"
//             }
//         },
//         { $sort: { isActive: -1 } },
//     ])
//         .then(contacts_ => {

//             contacts.populate(contacts_, { path: "contacts.contactId" })
//                 .then(_contacts => {


//                     res
//                         .status(200)
//                         .setHeader('Content-Type', 'application/json')
//                         .json(_contacts)

//                 }, err => next(err));

//             // res
//             //     .status(200)
//             //     .setHeader('Content-Type', 'application/json')
//             //     .json(contacts_)


//         }, err => next(err));

// }

// module.exports = {
//     getContacts
// }