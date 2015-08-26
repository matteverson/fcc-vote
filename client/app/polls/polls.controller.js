'use strict';

angular.module('workspaceApp')
  .controller('PollsCtrl', function ($scope, $http, Auth, PollsModel) {
    $scope.polls = [];
    $scope.loggedIn = Auth.isLoggedIn();

    PollsModel.all()
    .then(function(result) {
        $scope.polls = result.data;
    })
  });
