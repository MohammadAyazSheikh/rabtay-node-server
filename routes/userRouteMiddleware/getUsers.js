

const User = require('../../models/users');
const Contacts = require('../../models/contactsModel');
const ObjectId = require('mongoose').Types.ObjectId;


function GetUsers(req, res, next) {

    let names = req.body.username.split(' ');

    Contacts.aggregate([
        { $match: { userId: new ObjectId(req.user.id) } },
        { $unwind: "$contacts" },
        {
            $project: {
                contactId: "$contacts.contactId",
                _id: 0
            }
        },
    ])
        .then(contacts_ => {


            if (names.length > 1) {

                const fname = new RegExp(names[0], 'i');
                const lname = new RegExp(names[1], 'i');

                User.find(
                    {
                        $and: [
                            { $or: [{ "fname": fname }, { "lname": lname }] },
                            { _id: { $ne: req.user._id } }
                        ],
                    }
                )
                    .then((users) => {

                        let users_ = users.map(user => {
                            let _user = { ...user._doc };

                            for (let i = 0; i < contacts_.length; i++) {

                                if (contacts_[i].contactId.toString() === user._id.toString()) {

                                    _user.isFriend = true;
                                }
                                else {
                                    _user.isFriend = false;
                                }
                            }
                            return _user;
                        });

                        res
                            .status(200)
                            .setHeader('Content-Type', 'application/json')
                            .json(users_)

                    });

            }
            else {
                const uname = new RegExp(req.body.username, 'i');
                User.find(
                    {
                        $and: [
                            { $or: [{ "fname": uname }, { "lname": uname }] },
                            { _id: { $ne: req.user._id } }
                        ],
                    }
                )
                    .then((users) => {

                        let users_ = users.map(user => {
                            let _user = { ...user._doc };

                            for (let i = 0; i < contacts_.length; i++) {

                                if (contacts_[i].contactId.toString() === user._id.toString()) {

                                    _user.isFriend = true;
                                }
                                else {
                                    _user.isFriend = false;
                                }
                            }
                            return _user;
                        });

                        res
                            .status(200)
                            .setHeader('Content-Type', 'application/json')
                            .json(users_)

                    });

            }
        }, err => next(err));
}

module.exports = {
    GetUsers
}