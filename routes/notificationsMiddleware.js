const Notifications = require('../models/notificationModel');
const ObjectId = require('mongoose').Types.ObjectId;



const getNotifications = (req, res, next) => {

    Notifications.find({ to: req.user.id })
        .populate('from')
        .populate('to')
        .then((notific) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(notific);
        }, (err) => next(err))
        .catch((err) => next(err));
}


const getUnreadNotific = (req, res, next) => {

    Notifications.count({ to: new ObjectId(req.user.id), isRead: false })
        .then((notific) => {
            console.log(notific)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ unread: notific, succes: true });
        }, (err) => next(err))
        .catch((err) =>

            next(err)

        );
}

const markNotificRead = (req, res, next) => {

    Notifications.updateMany({ to: new ObjectId(req.user.id) }, { isRead: true }, { new: true })
        .then((notific) => {
            console.log(notific)
            Notifications.count({ to: new ObjectId(req.user.id), isRead: false })
                .then((notific) => {
                    console.log(notific);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ unread: notific, succes: true });
                }, (err) => next(err))
                .catch((err) => next(err));


        }, (err) => next(err))
        .catch((err) => next(err));
}



const dltNotific = (req, res, next) => {
    console.log(`snder id = ${req.body.userId}`);

    const fromId = req.body.isCreator ? req.user.id : req.body.userId;
    const toId = req.body.isCreator ? req.body.userId : req.user.id;

    Notifications.deleteOne({ to: toId, from: fromId, type: req.body.type })
        .then(data => {
            console.log(`\n\ndleted data = ${req.body.userId}\n\n`)
            Notifications.find({ to: req.user.id })
                .populate('from')
                .populate('to')
                .then((notific) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(notific);
                }, (err) => next(err))
                .catch((err) => next(err));
        }, (err) => next(err))
        .catch((err) => next(err));
}
module.exports = {
    getNotifications,
    getUnreadNotific,
    markNotificRead,
    dltNotific
};