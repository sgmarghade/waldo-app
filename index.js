'use strict';
require('./db');

const config = require('./config');
const Hapi = require('hapi');
const routes = require('./routes');
const inert = require('inert');
const vision = require('vision');
const hapiSwagger = require('hapi-swagger');

const server = new Hapi.Server({
  connections: {
    routes: {
      cors: true,
      response: {
        modify: true, //joi options
        options: {
          stripUnknown: true
        }
      }
    }
  }
});

server.connection({
  host: config.get("server:host"),
  port: Number(config.get("server:port"))
});


var swaggerOptions = {
  basePath: '/v1/',
  sortEndpoints: 'ordered',
  pathPrefixSize: 1,
  info: {
    'title': 'Waldo app',
    'version': '1.0.0',
  },
  security: [{ 'Bearer': [] }]
};

server.register([
  inert,
  vision,
  {
    register: hapiSwagger,
    options: swaggerOptions
  }
], function (err) {
  if(err) {
    console.error('failed to load plugin ', err);
    throw err;
  }

  server.route(routes);

  server.start(function () {
    console.log("server started at", server.info);
  });
});


module.exports = server;


