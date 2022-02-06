// require('dotenv').config();

const mongoose = require('mongoose');

// const url = process.env.DBURL;
// const url = "mongodb://mongo:27017/mydb";

const url = `mongodb+srv://${
  process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aoslv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to database");
}, (err) => { console.log(err); });
