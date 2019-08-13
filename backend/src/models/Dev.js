const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    user: {
        type: String,
        required: true,
    },
    
    avatar: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
});

module.exports = model('Dev', DevSchema);