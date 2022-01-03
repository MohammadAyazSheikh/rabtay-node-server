const contacts = require('../../models/contactsModel');
const notification = require('../../models/notificationModel');


const addContact = (req, res, next) => {

    dltNotific(req, req.body.contactId);

    contacts.findOne({ userId: req.user.id })
        .then(user => {

            addFriendContact(req, res, next);

            if (!user) {
                const newContact = new contacts({
                    userId: req.user.id,
                });

                newContact.save()
                    .then((user) => {

                        user.contacts.push({ contactId: req.body.contactId });
                        user.save()
                            .then(contact => {

                                contacts.findOne({ userId: req.user.id })
                                    .populate('contacts.contactId')
                                    .populate('userId')
                                    .then(contacts => {
                                        res
                                            .status(200)
                                            .setHeader('Content-Type', 'application/json')
                                            .json(contacts)
                                    }, err => next(err))
                            })
                    })
                    .catch((err) => {
                        // res.status(200).json({ succes: false, error: err });
                        next(err);
                    });

            }
            else {
                user.contacts.push({ contactId: req.body.contactId });
                user.save()
                    .then(contact => {
                        contacts.findOne({ userId: req.user.id })
                            .populate('contacts.contactId')
                            .populate('userId')
                            .then(contacts => {
                                res
                                    .status(200)
                                    .setHeader('Content-Type', 'application/json')
                                    .json(contacts)
                            }, err => next(err))
                    });
            }
        });

}


const addFriendContact = (req, res, next) => {

    contacts.findOne({ userId: req.body.contactId })
        .then(user => {

            if (!user) {
                const newContact = new contacts({
                    userId: req.body.contactId,
                });

                newContact.save()
                    .then((user) => {

                        user.contacts.push({ contactId: req.user.id });
                        user.save()
                            .then(contact => {
                                contacts.findOne({ userId: req.body.contactId })
                                    .populate('contacts.contactId')
                                    .then(contacts => {
                                        // res
                                        //     .status(200)
                                        //     .setHeader('Content-Type', 'application/json')
                                        //     .json(contacts)

                                        console.log(JSON.stringify(contacts));

                                    }, err => next(err))
                            })
                    })
                    .catch((err) => {
                        // res.status(200).json({ succes: false, error: err });
                        next(err);
                    });

            }
            else {
                user.contacts.push({ contactId: req.user.id });
                user.save()
                    .then(contact => {
                        contacts.findOne({ userId: req.body.contactId })
                            .populate('contacts.contactId')
                            .then(contacts => {
        
                                console.log(JSON.stringify(contacts));
                                
                            }, err => next(err))
                    });
            }
        });

}

const dltNotific = (req, senderId) => {
    notification.deleteOne({ to: req.user.id, from: senderId })
        .then(data => {
            console.log('deleted');
        })
}

module.exports = {
    addContact
}