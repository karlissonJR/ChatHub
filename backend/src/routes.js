const express = require('express');

const DevController = require('./controllers/DevController');
const MessageController = require('./controllers/MessageController');

const routes = express.Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.post('/message', MessageController.store);
routes.get('/message', MessageController.index);

module.exports = routes;