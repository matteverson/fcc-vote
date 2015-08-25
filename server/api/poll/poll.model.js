'use strict';

var User = require('../user/user.model');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: String,
  options: [{name: String, votes: Number}],
  voters: [{type: Schema.Types.ObjectId, ref: User}],
  owner: {type: Schema.Types.ObjectId, ref: User}
});

PollSchema
.path('options')
.validate(function(options) {
  return options.length;
}, 'Options cannot be blank');

module.exports = mongoose.model('Poll', PollSchema);
