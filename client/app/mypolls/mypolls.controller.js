'use strict';

angular.module('workspaceApp')
  .controller('MypollsCtrl', function ($scope, PollsModel, Auth, $http, $modal, $location) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.loggedIn = Auth.isLoggedIn();
    $scope.polls = [];
    $scope.newPoll = null;
    $scope.selectedPoll = null;

    var initCreateForm = function() {
      $scope.newPoll = {name : '', options: [{name: '', votes: 0}], owner: $scope.currentUser};
    };

    var initBarData = function() {
      $scope.barData = {labels: [], datasets: [{ data: [] }]};
    };

    var getItems = function() {
      PollsModel.owned(Auth.getCurrentUser()._id)
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
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,1)",
            data: data
          }]
        };
    };

    $scope.closeResults = function() {
      $scope.selectedPoll = null;
      initBarData();
    };

    $scope.selectPoll = function(poll) {
      $scope.barData = getBarData(poll);
      $scope.selectedPoll = poll;
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

    $scope.isCurrentPoll = function(pollId) {
      return $scope.selectedPoll !== null && $scope.selectedPoll._id === pollId;
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

    $scope.deletePoll = function(poll) {
      if ($scope.loggedIn && poll.owner == $scope.currentUser._id) {
        PollsModel.delete(poll._id)
        .then(function(result) {
          getItems();
        });
      }
    };

    $scope.addOption = function() {
      $scope.newPoll.options.push({name: '', votes: 0});
    };

    $scope.removeOption = function(item) {
      var index = $scope.newPoll.options.indexOf(item);
      $scope.newPoll.options.splice(index, 1);
    };

    initCreateForm();
    initBarData();
    getItems();
  });
