const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
    author: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
});

module.exports = model('Message', MessageSchema);