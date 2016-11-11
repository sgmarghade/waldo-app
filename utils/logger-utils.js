/**
 * Created by swapnil on 05/03/16.
 */
'use strict';
var winston = require('winston');
var moment = require('moment');

//******* Using winston **********//
var winstonConsoleTransporter =
  new (winston.transports.Console)({
    level: 'silly',
    'timestamp': function () {
      var ts = moment();
      return " [waldo] "+"[" + ts.format("x") + "] [" + ts.format("DD-MM-YYYY HH:mm:ss.SSS Z") + "]";
    },
    prettyPrint: false,
    showLevel: true,
    silent: false,
  });


var winstonLoggerConfig = new (winston.Logger)({
  transports: [winstonConsoleTransporter]
});

module.exports.logger = winstonLoggerConfig;

