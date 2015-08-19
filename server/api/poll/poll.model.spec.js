'use strict';

var should = require('should');
var app = require('../../app');
var Poll = require('./poll.model');

var poll = new Poll({
  name: 'Favorite fruit',
  options: [{name: 'Apple', votes: 1}, {name: 'Banana', votes: 3}],
  owner: 1
});

describe('Poll Model', function() {
  before(function(done) {
    // Clear polls before testing
    Poll.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Poll.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no polls', function(done) {
    Poll.find({}, function(err, polls) {
      polls.should.have.length(0);
      done();
    });
  });

  it('should fail when saving without any options', function(done) {
    poll.options = [];
    poll.save(function(err) {
      should.exist(err);
      done();
    });
  });
});
