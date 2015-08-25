'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');
var User = require('../user/user.model');

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Adds a vote for a chosen poll option and marks it as "voted on" for the user.
exports.addVote = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if (!poll) { return res.status(404).send('Not Found'); }

    if (!req.body.user) { return res.status(404).send('User is not logged in'); }
    var user = User.findById(req.body.user._id, function(err, user) {
      if (err) { return handleError(res, err); }
      if (!user) { return res.status(404).send('No such user found'); }

      if (poll.voters && poll.voters.indexOf(req.body.user._id) !== -1) {
        return res.status(500).send('You already voted on this poll');
      }

      var vote = req.body.vote;
      // Find the poll option we're voting on
      poll.options = poll.options.map(function(option) {
        if (option.name === req.body.name)
          option.votes++;

        return option;
      });
      poll.voters.push(req.body.user._id);

      poll.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(poll);
      });
    });
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var updated = _.merge(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
