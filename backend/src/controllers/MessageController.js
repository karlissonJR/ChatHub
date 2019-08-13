const axios = require('axios');
const Message = require('../models/Message');

module.exports = {

    async index(req, res){
        const users = await Message.find({});
        console.log(users)
        
        return res.json(users);
    },

    async store(req, res){
        console.log(req.body);

        const {author, text} = req.body;

        const message = await Message.create({
            author: author,
            text: text
        });

        return res.json(message);
    }
};