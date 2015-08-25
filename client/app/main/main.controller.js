'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, PollsModel) {
    $scope.polls = [];

    PollsModel.all()
    .then(function(result) {
        $scope.polls = result.data;
    })
  });
