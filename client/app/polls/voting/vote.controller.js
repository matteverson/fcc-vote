'use strict';

angular.module('workspaceApp')
  .controller('VoteCtrl', function ($scope, Auth, $http, $routeParams) {
    var currentUser = Auth.getCurrentUser();
    var requestedId = $routeParams.id;
    $scope.loggedin = Auth.isLoggedIn();
    $scope.vote = {
      user: {_id: currentUser._id},
      name: ""
    };

    $http.get('/api/polls/' + requestedId).success(function(poll) {
      $scope.poll = poll;
      $scope.voted = (poll.voters && poll.voters.indexOf(currentUser._id) !== -1);
    });

    $scope.castVote = function() {
        $http.post('/api/polls/vote/' + requestedId, $scope.vote)
        .success(function(poll) {
          $scope.voted = true;
          $scope.poll = poll;
        })
        .error(function(data, status) {
          $scope.voted = true;
        });
    };

  });
