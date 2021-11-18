const { json } = require('express');
var express = require('express');
var router = express.Router();
const User = require('../models/users');
const utils = require('../lib/utils');
const passport = require('passport');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
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

      // Function defined at bottom of app.js
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

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt
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

module.exports = router;
