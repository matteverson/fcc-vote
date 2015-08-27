'use strict';

angular.module('workspaceApp')
  .controller('VoteCtrl', function ($scope, Auth, $http, $routeParams) {
    var currentUser = Auth.getCurrentUser();
    var requestedId = $routeParams.id;
    $scope.barData = {labels: [], datasets: [{ data: [] }]};
    $scope.loggedIn = Auth.isLoggedIn();
    $scope.vote = {
      user: {_id: currentUser._id},
      name: ""
    };

    function getBarData(poll) {
        var labels = poll.options.map(function(opt) { return opt.name; });
        var data = poll.options.map(function(opt) { return opt.votes; });
        return {
          labels: labels,
          datasets: [{
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,1)",
            data: data
          }]
        };
    };

    var getPoll = function() {
      $http.get('/api/polls/' + requestedId).success(function(poll) {
        $scope.poll = poll;
        $scope.voted = (poll.voters && poll.voters.indexOf(currentUser._id) !== -1);

        $scope.barData = getBarData(poll);
      });
    };

    $scope.castVote = function() {
      if (!Auth.isLoggedIn()) {
        return;
      }
        $http.post('/api/polls/vote/' + requestedId, $scope.vote)
        .success(function(poll) {
          $scope.voted = true;
          $scope.poll = poll;
          $scope.barData = getBarData(poll);
        })
        .error(function(data, status) {
          $scope.voted = true;
        });
    };

    getPoll();
  });
