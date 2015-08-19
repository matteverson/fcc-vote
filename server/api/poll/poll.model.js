'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: String,
  options: [{name: String, votes: Number}]
});

PollSchema
.path('options')
.validate(function(options) {
  return options.length;
}, 'Options cannot be blank');

module.exports = mongoose.model('Poll', PollSchema);
