require('dotenv').config();

const mongoose = require('mongoose');

const url = process.env.DBURL;

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to database");
}, (err) => { console.log(err); });
