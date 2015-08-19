'use strict';

angular.module('workspaceApp')
  .controller('PollsCtrl', function ($scope, $http) {
    $scope.polls = [];
    $scope.poll = {
      name    : 'Worst fruit',
      options : [{name: 'Apple', votes: 0}, {name: 'Banana', votes: 0}]
    };

    $scope.$watch('poll', function (poll) {
      $scope.form.$setValidity('count', poll.options && poll.options.length >= 1);
    }, true);

    $http.get('/api/polls').success(function(polls) {
      $scope.polls = polls;
    });

    $scope.addPoll = function(form) {
      if (form.$valid)
      {
        $http.post('/api/polls', $scope.poll);
        $scope.poll = '';
      }
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    $scope.remove = function(item) {
      var index = $scope.poll.options.indexOf(item);
      $scope.poll.options.splice(index, 1);
    }
  });
