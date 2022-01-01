var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Contacts = require('../models/contactsModel');
const ObjectId = require('mongoose').Types.ObjectId;
const utils = require('../lib/utils');
const passport = require('passport');
const { getNotifications, getUnreadNotific, markNotificRead, dltNotific } = require('./notifications');
const { addContact } = require('./contactRouteMiddleware/addContact');
const { getContacts } = require('./contactRouteMiddleware/getContacts');







/* GET users listing. */
router.route('/')
  .get(function (req, res, next) {

    // res.status(200).send('User route')
    res.status(200).json({ succes: true })

  })

  //---------Getting User-------------------------
  .post(passport.authenticate('jwt', { session: false }), function (req, res, next) {

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

  });




router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!" });
});


router.post('/login', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {

      if (!user) {
        return res.status(401).json({ success: false, msg: "could not find user" });
      }


      const isValid = utils.validPassword(req.body.password, user.hash, user.salt);

      if (isValid) {

        const { token, expiresIn } = utils.issueJWT(user);

        res.status(200).json({ success: true, token, expiresIn, user });

      } else {

        res.status(401).json({ success: false, msg: "you entered the wrong password" });

      }

    })
    .catch((err) => {
      next(err);
    });
})

router.post('/signup', (req, res, next) => {

  const { hash, salt } = utils.genPassword(req.body.password);

  let fname = req.body.fname.slice(1);
  let lname = req.body.lname.slice(1);
  fname = req.body.fname.charAt(0).toUpperCase() + fname;
  lname = req.body.lname.charAt(0).toUpperCase() + lname;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt,
    fname: fname,
    lname: lname,
    dob: req.body.dob,
    gender: req.body.gender,
    about: req.body.about || '',
  });

  newUser.save()
    .then((user) => {
      const { token, expiresIn } = utils.issueJWT(user);

      return res.json({ success: true, user: user, token, expiresIn });

    })
    .catch((err) => {
      next(err);
    });
})

//=========================================== Notifications ==================================

router.route('/notifications')
  .get(passport.authenticate('jwt', { session: false }), getNotifications)
  .delete(passport.authenticate('jwt', { session: false }), dltNotific);

router.route('/notifications/unread')
  .get(passport.authenticate('jwt', { session: false }), getUnreadNotific);

router.route('/notifications/read')
  .get(passport.authenticate('jwt', { session: false }), markNotificRead);



//=========================================== Contacts Routes ==================================
router.post('/addcontact', passport.authenticate('jwt', { session: false }), addContact);
router.get('/getcontact', passport.authenticate('jwt', { session: false }), getContacts);


module.exports = router;



/*

    let names = req.body.username.split(' ');


    //if user searches both fname and lname
    if (names.length > 1) {

      const fname = new RegExp(names[0], 'i');
      const lname = new RegExp(names[1], 'i');

      User.find({ $or: [{ "fname": fname }, { "lname": lname }] })
        .then((users) => {
          res.status(200).json({ users });
        });

    }
    else {
      const uname = new RegExp(req.body.username, 'i');

      User.find({ $or: [{ "fname": uname }, { "lname": uname }] })
        .then((users) => {
          res.status(200).json({ users });
        });
    }
*/