'use strict';

angular.module('workspaceApp')
  .service('PollsModel', function ($http, ENDPOINT_URI) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = this,
    path = 'polls/';

    function getUrl() {
      return ENDPOINT_URI + path;
    }

    function getUrlForId(pollId) {
      return getUrl() + PollId;
    }

    service.all = function () {
      return $http.get(getUrl());
    };

    service.create = function(poll) {
      return $http.post(getUrl(), poll);
    };

    service.update = function (pollId, poll) {
      return $http.put(getUrlForId(pollId), poll);
    };

    service.delete = function(pollId) {
      return $http.delete(getUrlForId(pollId));
    };
  });
