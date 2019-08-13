const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express(); // criando um servidor
const server = require('http').Server(app);//define o protocolo http
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket =>{
    
    socket.on('sendMessage', data => {
        socket.broadcast.emit('receivedMesage', data);
    });
});

mongoose.connect('mongodb+srv://karlisson:karlisson@cluster0-yrvrm.mongodb.net/github_users?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333); //porta que o servidor vai ouvir