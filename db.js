'use strict';

var Mongoose = require('mongoose');
var config = require('./config');
var logger = require("./utils/logger-utils").logger;
Mongoose.set('debug', true);

Mongoose.connect('mongodb://' + config.get("mongo:host")+':' +config.get("mongo:port") + '/' + config.get("mongo:db"));
var db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    logger.info("Connection with database succeeded.");
});

exports.Mongoose = Mongoose;
exports.db = db;