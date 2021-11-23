const express = require('express');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');


const isDirectoryExist = (req, res, next) => {
    const dirUser = `./public/users/${req.user.username}`;
    const dirImages = `./public/users/${req.user.username}/images`;

    // check if directory exists
    if (fs.existsSync(dirImages)) {
        next();
    } else {

        if (fs.existsSync(dirUser)) {

            fs.mkdirSync(dirImages, (err) => {

                if (err) {
                    throw err;
                }
            });

            next();
        }
        else {
            fs.mkdirSync(dirUser, (err) => {

                if (err) {
                    throw err;
                }
            });

            fs.mkdirSync(dirImages, (err) => {

                if (err) {
                    throw err;
                }
            })

            next();
        }

    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
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
    .get(passport.authenticate('jwt', { session: false }), isDirectoryExist, (req, res, next) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .post(upload.single('imageFile')/*imageFile is form url/method/key name*/, (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
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