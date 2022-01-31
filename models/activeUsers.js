var mongoose = require('mongoose');
var Schema = mongoose.Schema;




const activeUsers = new Schema(
    {
        // userId: {
        //     type: String,
        //     required: true,
        //     unique: true,
        //     dropDups: true
        // },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true,
            dropDups: true
        },
        socketId: {
            type: String,
            required: true,
            unique: true,
            dropDups: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            dropDups: true
        },
        isActive: {
            type: Boolean,
            required: true,
            default: false
        },
        onCall: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('activeUsers', activeUsers);