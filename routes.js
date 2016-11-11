const Joi = require('joi');
var controller = require('./controller');

module.exports = [

  {
    method: "POST",
    path: "/v1/documents",
    config: {
      description:"Crawl links",
      tags:['api'],
      plugins: {
        'hapi-swagger': {
          order: 1
        }
      },
      payload:{
        timeout:5000
      },
      timeout:{
        socket:100000000
      },
      handler: controller.fetchDocuments
    }
  },
  {
    method: "GET",
    path:"/v1/documents",
    config:{
      description:"Get documents",
      tags:['api'],
      plugins: {
        'hapi-swagger': {
          order: 1
        }
      },
      handler: controller.getDocuments
    }
  }
]
