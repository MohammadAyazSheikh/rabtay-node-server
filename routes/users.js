const { json } = require('express');
var express = require('express');
var router = express.Router();
var User = require('../models/users');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', (req, res, next) => {

  res.send('login route');
})

router.post('/signup', (req, res, next) => {

  console.log(JSON.stringify(req.body))
  let uname = req.body.username;
  let pass = req.body.password;

  console.log(uname, pass)
  res.send('login route');
})

module.exports = router;
