'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, PollsModel, Auth) {
    $scope.polls = [];
    $scope.loggedIn = Auth.isLoggedIn();

    function getBarData(poll) {
        var labels = poll.options.map(function(opt) { return opt.name; });
        var data = poll.options.map(function(opt) { return opt.votes; });
        return {
          labels: labels,
          datasets: [{
            data: data
          }]
        };
    };

    PollsModel.all()
    .then(function(result) {
        $scope.polls = result.data.map(function(poll) {
          poll.barData = getBarData(poll);
          return poll;
        });
    })
  });
