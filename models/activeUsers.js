var mongoose = require('mongoose');
var Schema = mongoose.Schema;




const activeUsers = new Schema(
    {
        userID: {
            type: String,
            required: true,
            unique: true,
            dropDups: true
        },
        socketID: {
            type: String,
            required: true,
            unique: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ativeUsers', activeUsers);