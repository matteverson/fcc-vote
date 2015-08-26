'use strict';

angular.module('workspaceApp')
  .controller('MypollsCtrl', function ($scope, PollsModel, Auth, $http, $modal, $location) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.loggedIn = Auth.isLoggedIn();
    $scope.polls = [];
    $scope.newPoll = null;
    $scope.editedPoll = null;
    $scope.isEditing = false;

    var initCreateForm = function() {
      $scope.newPoll = {name : '', options: [{name: '', votes: 0}], owner: $scope.currentUser};
    };

    var initBarData = function() {
      $scope.barData = {labels: [], datasets: [{ data: [] }]};
    };

    var getItems = function() {
      PollsModel.all()
      .then(function(result) {
        $scope.polls = result.data;
      })
    };

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

    $scope.closeResults = function() {
      initBarData();
    };

    $scope.selectPoll = function(poll) {
      $scope.barData = getBarData(poll);
    };

    $scope.getSharingLink = function(poll) {
      var pollUrl = $location.protocol() + "://"
      + location.host
      + '/polls/'
      + poll._id;
      $modal.open( {
        templateUrl: 'app/mypolls/polllinkmodal.html',
        controller: 'PollLinkModalCtrl',
        resolve: {
          poll: function () {
            return { name: poll.name, url: pollUrl};
          }
        }
      });
    };

    $scope.isCurrentItem = function(pollId) {
      return $scope.editedItem !== null && $scope.editedItem._id === pollId;
    };

    $scope.addPoll = function() {
      if ($scope.loggedIn)
      {
        PollsModel.create($scope.newPoll)
        .then(function(result) {
          initCreateForm();
          getItems();
        });
      }
    };

    $scope.updatePoll = function() {
      PollsModel.update($scope.editedPoll._id, $scope.editedPoll)
      .then(function(result) {
          $scope.cancelEditing();
          getItems();
      })
    };

    $scope.deletePoll = function(poll) {
      if ($scope.loggedIn && poll.owner == $scope.currentUser._id) {
        PollsModel.delete(poll._id)
        .then(function(result) {
          $scope.cancelEditing();
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
      $scope.editedPoll = angular.copy(poll);
      $scope.isEditing = true;
    };

    $scope.cancelEditing = function() {
      $scope.editedPoll = null;
      $scope.isEditing = false;
    };

    initCreateForm();
    initBarData();
    getItems();
  });
