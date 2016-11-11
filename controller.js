const config = require('./config');
const uuid = require('node-uuid');
const requestPromise = require('request-promise');
const Boom = require('boom');
const logger = require('./utils/logger-utils').logger;
const Document = require('./models/mongo/document').Document;
const xmlParser = require('xml2js').parseString;
const Promise = require('bluebird');
const ExifImage = require('exif').ExifImage;
const async = require('async');
const request = require('request');
const baseUrl = "http://s3.amazonaws.com/waldo-recruiting";
const qs = require('qs');

/**
 * Gets promise with JPEG image links to fetch from.
 * @returns {Promise}
 */
function getLinks(){
  return new Promise(function(resolve){
    s3XmlResponse = requestPromise(baseUrl);

    s3XmlResponse.then(function(body){
      xmlParser(body,function(err,result){
        logger.debug(JSON.stringify(result));
        let keyList = result.ListBucketResult.Contents.map(function(content){
          return content.Key[0];
        });
        resolve(keyList);
      });
    });

  });
}

module.exports = {

  /**
   * Fetches documents from given URL list.
   * @param req
   * @param reply
   */
  fetchDocuments: function (req, reply) {
    //Get links can be from Queue. Or fetch document can be called with 1 url at a time.
    let listPromise = getLinks();

    listPromise.then(function(list){

      async.eachSeries(list,function(item,callback){
        let imageUrl = `${baseUrl}/${item}`;

        Document.findOne({key:item},function(err,data){
          if(!data){
            //Fetch image if it's not fetched yet.
            logger.debug("** Fetching : ",imageUrl);
            request({url:imageUrl,encoding:null},function (error, response, body) {

              //Exif data extractor from image.
              new ExifImage({ image : body}, function (error, exifData) {
                if (error) {
                  logger.debug('Error: ' + error.message);
                  callback(err);
                }
                else {
                  let document = new Document({key:item,data:exifData});

                  document.save(function(err,doc){
                    callback(err);
                  });
                }
              });
            });

          }else{
            //Skip process if image is already been fetched.
            logger.debug("Key : "+item+" already exists. Skipping Fetching..!");
            callback(null);
          }
        })
      }, function done() {
        reply({message:"success"});
      });
    });
  },

  /**
   * Searches document as per criteria.
   * Currently supports only AND condition on string value fields.
   * @param request
   * @param reply
   */
  getDocuments: function(request,reply){
    let params = qs.parse(request.query);
    let criteria = params.criteria ? params.criteria : {};
    let sort = params.sort || { createdAt: -1 };
    let limit = parseInt(params.limit) || 10;
    let page = parseInt(params.page) || 0;

    let skip = Number.isInteger(limit) ? limit * page : undefined;
    let populate = params.populate || [];
    let select = params.select || '';

    Document.find(criteria)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec(function(err, docs){
        reply(docs);
      });
  }
}