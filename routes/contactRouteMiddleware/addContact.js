const contacts = require('../../models/contactsModel');

const addContact = (req, res, next) => {


    addFriendContact(req, res, next);

    contacts.findOne({ userId: req.user.id })
        .then(user => {

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
                                // res
                                //     .status(200)
                                //     .setHeader('Content-Type', 'application/json')
                                //     .json(contacts)
                                console.log(JSON.stringify(contacts));
                            }, err => next(err))
                    });
            }
        });

}

module.exports = {
    addContact,
    addFriendContact
}