const contacts = require('../../models/contactsModel');
const notification = require('../../models/notificationModel');
const { getContacts } = require('./getContacts');
const ObjectId = require('mongoose').Types.ObjectId;

const dltContact = (req, res, next) => {

    contacts.updateOne(
        { userId: req.user.id },
        {
            $pull: {
                contacts: {
                    contactId: new ObjectId(req.body.userId)
                }
            }
        })
        .then(contacts => {
            console.log(`My contacts deleted ${contacts}`);
            dltFrndContact(req, res, next);
            getContacts(req, res, next);
            // res.status(200)
            //     .setHeader('Content-Type', 'application/json')
            //     .json(contacts)

        }, err => next(err))
        .catch(err => next(err));
}

const dltFrndContact = (req, res, next) => {

    contacts.updateOne(
        { userId: req.body.userId },
        {
            $pull: {
                contacts: {
                    contactId: new ObjectId(req.user.id)
                }
            }
        })
        .then(contacts => {
            console.log(`frnd contacts deleted ${contacts}`);
        }, err => next(err))
        .catch(err => next(err));
}

module.exports = {
    dltContact
}