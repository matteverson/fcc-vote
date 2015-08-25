'use strict';

angular.module('workspaceApp')
  .controller('PollsCtrl', function ($scope, $http, Auth, PollsModel) {
    $scope.polls = [];

    PollsModel.all()
    .then(function(result) {
        $scope.polls = result.data;
    })
  });
