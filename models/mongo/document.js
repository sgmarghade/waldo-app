'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  data: {
    type: Object
  }
}, {timestamps: true});

var Document = mongoose.model('Document', documentSchema);

module.exports = {
  Document: Document
};