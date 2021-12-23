var mongoose = require('mongoose');
const { Schema } = mongoose;

// from: {
//     // type: String,
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref:'User'
// },

const _contacts = new Schema(
    {
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

const contacts = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        contacts: [_contacts]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('contacts', contacts);