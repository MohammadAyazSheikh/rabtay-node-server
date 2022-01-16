var express = require('express');
var router = express.Router();
const User = require('../models/users');
const utils = require('../lib/utils');
const passport = require('passport');
const { getNotifications, getUnreadNotific, markNotificRead, dltNotific } = require('./notificationsMiddleware');
const { addContact } = require('./contactRouteMiddleware/addContact');
const { getContacts } = require('./contactRouteMiddleware/getContacts');
const { dltContact } = require('./contactRouteMiddleware/dltContact');
const { GetUsers } = require('./userRouteMiddleware/getUsers');
const { GetSingleUsers } = require('./userRouteMiddleware/getSingleUser');
const { addMessage } = require('./chatRouteMiddleware/addMessage');
const { getChats, getSingleChat } = require('./chatRouteMiddleware/getChats');

const contacts = require('../models/contactsModel');
const chats = require('../models/chatModel');
const ObjectId = require('mongoose').Types.ObjectId;





router.post('/test', passport.authenticate('jwt', { session: false }), (req, res, next) => {

  console.log(req.body.chatId);
  console.log(req.user._id);

  chats.updateMany(
    {
      // _id: req.body.chatId,
      messages: { $elemMatch: { isSeen: false, from: req.user._id } }
    },
    // [
    //   { $set: { "messages.$.isSeen": true } }
    //   // { $unset: ["misc1", "misc2"] }
    // ]
    { $set: { "messages.$.isSeen": true } } //$ is for posstion
  )
    .then(data => {
      console.log(data)
      res.status(200).json(data);
    }, err => next(err))
    .catch(err => { next(err) })


  /*
  //if array has primitve value dont have objects
  db.students.updateOne(
   { _id: 1, grades: 80 },
   { $set: { "grades.$" : 82 } }
  )
  */

  /*
  //matcing multi array elment
  db.students.updateOne(
     {
       _id: 5,
       grades: { $elemMatch: { grade: { $lte: 90 }, mean: { $gt: 80 } } }
     },
     { $set: { "grades.$.std" : 6 } }
  )
  */

  /*
  //matcing only one array elment
  db.students.updateOne(
   { _id: 4, "grades.grade": 85 },
   { $set: { "grades.$.std" : 6 } }
)
  */
});








/* GET users listing. */
router.route('/')
  .get(function (req, res, next) {

    // res.status(200).send('User route')
    res.status(200).json({ succes: true })

  })

  //---------Getting User-------------------------
  .post(passport.authenticate('jwt', { session: false }), GetUsers);

router.route('/singleuser')
  .post(passport.authenticate('jwt', { session: false }), GetSingleUsers)






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
router.post('/dltcontact', passport.authenticate('jwt', { session: false }), dltContact);


//=========================================== Chats Routes ==================================
router.post('/addMessage', passport.authenticate('jwt', { session: false }), addMessage);
router.get('/getMessage', passport.authenticate('jwt', { session: false }), getChats)
router.get('/getMessage/:chatId', passport.authenticate('jwt', { session: false }), getSingleChat);


// router.route('/test')
//   .get((req, res, next) => {
//     res.status(200).send("test");
//   });

// router.route('/test/:id')
//   .get((req, res, next) => {
//     res.status(200).send(`${req.params.id}`);
//   });



module.exports = router;



/*




*/