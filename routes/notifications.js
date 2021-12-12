var express = require('express');
const Notifications = require('../models/notificationModel');
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');


const getNotifications = (req, res, next) => {

    Notifications.find({ to: req.user.id })
        .populate('from')
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

    // res.status(200).send('User route')


}

module.exports = {
    getNotifications,
    getUnreadNotific,
};