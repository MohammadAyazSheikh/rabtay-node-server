const express = require('express');
const multer = require('multer');
const passport = require('passport');
const User = require('../models/users');
const isDirectoryExist = require('../config/profileImageDirConfig');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./public/users/${req.user.username}/images`);
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname) //use orignal file name to save on serverside
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false); //only image
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();


uploadRouter.route('/')

    /*imageFile is form url/method/key name*/
    .post(passport.authenticate('jwt', { session: false }), isDirectoryExist, upload.single('imageFile'), (req, res) => {
        // req.file.destination



        User.findByIdAndUpdate(req.user.id, {
            $set: {
                profileImage: { path: req.file.destination }
            },
        },null)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));






        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json(req.file);
    })




    .get(passport.authenticate('jwt', { session: false }), isDirectoryExist, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /imageUpload');
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    });

module.exports = uploadRouter;