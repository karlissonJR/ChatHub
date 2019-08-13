const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {

    async index(req, res){
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = [loggedDev];
        
        return res.json(users);
    },

    async store(req, res){
        console.log(req.body.username);

        const {username} = req.body;

        const userExists = await Dev.findOne({ user: username});

        if(userExists){
            return res.json(userExists);
        }
        
        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: img } = response.data;
        const dev = await Dev.create({
            name: name,
            user: username,
            bio: bio,
            avatar: img
        });

        return res.json(dev);
    }
};