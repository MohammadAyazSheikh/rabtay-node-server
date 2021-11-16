var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', (req, res, next) => {

  res.send('login route');
})

router.post('/signup', (req, res, next) => {

  res.send('signup route');
})

module.exports = router;
