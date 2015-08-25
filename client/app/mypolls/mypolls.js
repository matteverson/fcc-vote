'use strict';

angular.module('workspaceApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mypolls', {
        templateUrl: 'app/mypolls/mypolls.html',
        controller: 'MypollsCtrl'
      });
  });
