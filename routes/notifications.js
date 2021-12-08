var express = require('express');
const Notifications = require('../models/notificationModel');
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


module.exports = {
    getNotifications
};