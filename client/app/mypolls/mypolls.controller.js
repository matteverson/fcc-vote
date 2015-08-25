'use strict';

angular.module('workspaceApp')
  .controller('MypollsCtrl', function ($scope, PollsModel, Auth, $http) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.loggedIn = Auth.isLoggedIn();
    $scope.polls = [];
    $scope.newPoll = null;
    $scope.editedPoll = null;
    $scope.isEditing = false;

    var initCreateForm = function() {
      $scope.newPoll = {name : '', options: [{name: '', votes: 0}], owner: $scope.currentUser};
    };

    var getItems = function() {
      PollsModel.all()
      .then(function(result) {
        $scope.polls = result.data;
      })
    };

    $scope.isCurrentItem = function(pollId) {
      return $scope.editedItem !== null && $scope.editedItem._id === pollId;
    };

    //$scope.$watch('newPoll', function (poll) {
    //  $scope.form.$setValidity('count', poll.options && poll.options.length >= 1);
    //}, true);

    $scope.addPoll = function(form) {
      if (form.$valid && $scope.loggedIn)
      {
        PollsModel.create($scope.newPoll)
        .then(function(result) {
          initCreateForm();
          getItems();
        });
      }
    };

    $scope.updatePoll = function(poll) {
      PollsModel.update(poll._id, poll)
      .then(function(result) {
          cancelEditing();
          getItems();
      })
    };

    $scope.deletePoll = function(poll) {
      if ($scope.loggedIn && poll.owner === $scope.currentUser) {
        PollsModel.delete(poll._id)
        .then(function(result) {
          cancelEditing();
          getItems();
        });
      }
    };

    $scope.addOption = function() {
      if ($scope.isEditing) {
        $scope.editedPoll.options.push({name: '', votes: 0});
      }
      else {
        $scope.newPoll.options.push({name: '', votes: 0});
      }
    };

    $scope.removeOption = function(item) {
      if ($scope.isEditing) {
        var index = $scope.editedPoll.options.indexOf(item);
        $scope.editedPoll.options.splice(index, 1);
      }
      else {
        var index = $scope.newPoll.options.indexOf(item);
        $scope.newPoll.options.splice(index, 1);
      }
    };

    $scope.setEditedPoll = function(poll) {
      console.log(poll);
      $scope.editedPoll = angular.copy(poll);
      $scope.isEditing = true;
    };

    $scope.cancelEditing = function() {
      $scope.editedPoll = null;
      $scope.isEditing = false;
    };

    initCreateForm();
    getItems();
  });
