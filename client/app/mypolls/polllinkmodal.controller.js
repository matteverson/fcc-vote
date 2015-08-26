'use strict';

angular.module('workspaceApp')
.controller('PollLinkModalCtrl', function ($scope, $modalInstance, poll) {
  $scope.poll = poll;
  $scope.ok = function () {
    $modalInstance.dismiss('cancel');
  };

});
