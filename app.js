// Basic Setup
var express = require('express'),
    app     = express(),
    jwt     = require('jsonwebtoken');

// Database
var mongoose = require('mongoose'),
    mysql    = require('mysql'),
    config   = require('./config.json');

app.set('connection', mysql.createConnection({
        host     : config.mysql.host,
        user     : config.mysql.user,
        password : config.mysql.password,
        database : config.mysql.database
    })
);
try {
    app.get('connection').connect();
} catch(e) {
    throw new Error('MySQL radius database connection failed:' + e);
}
try {
    mongoose.connect('mongodb://localhost:27017/radius', {useMongoClient: true});
} catch(e) {
    throw new Error('MongoDB connection failed:' + e);
}

// Endpoints
app.get('/', function (req, res) {
    res.jsonp({message: 'radius-api is ready to listen your request'});
});

var AuthController = require('./app/auth/AuthController');
app.use('/', AuthController);

var RadiusController = require('./app/radius/RadiusController');
app.use('/radius-users', RadiusController);

var UserController = require('./app/user/UserController');
app.use('/users', UserController);

module.exports = app;