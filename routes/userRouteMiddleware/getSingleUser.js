

const User = require('../../models/users');
const Contacts = require('../../models/contactsModel');
const Notifications = require('../../models/notificationModel');
const ObjectId = require('mongoose').Types.ObjectId;


function GetSingleUsers(req, res, next) {

    console.log(req.params.uId)
    User.findById(req.body.userId)
        .then(user => {

            Notifications.findOne({ from: req.user.id, to: req.body.userId, type: 'follow' })
                .then(notific => {
                    let _user = { ...user._doc }

                    if (notific)
                        _user.isReqSent = true;
                    else
                        _user.isReqSent = false;


                    Contacts.aggregate([
                        { $match: { userId: new ObjectId(req.user.id) } },
                        { $unwind: "$contacts" },
                        {
                            $project: {
                                contactId: "$contacts.contactId",
                                _id: 0
                            }
                        },
                    ]).
                        then(_cont => {

                            for (let i = 0; i < _cont.length; i++) {

                                if (_cont[i].contactId.toString() === user._id.toString()) {

                                    _user.isFriend = true;
                                    break;
                                }
                                else {
                                    _user.isFriend = false;
                                }
                            }
                            res.status(200)
                                .setHeader('Content-Type', 'application/json')
                                .json(_user)
                        }, err => next(err))
                        .catch(err => next(err));



                }, err => next(err))
                .catch(err => next(err));


        }, err => next(err))
        .catch(err => next(err))

}

module.exports = {
    GetSingleUsers
}