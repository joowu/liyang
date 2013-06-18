define(['angular', 'apps/apps'], function (angular) {
  'use strict';

  var module = angular.module('app', ['app.apps']);
  module.run(['$rootScope', 'userService', '$timeout',
    function ($scope, userService, $timeout) {
      $scope.userService = userService;

      $scope.$on('event:auth-loginRequired', function () {
        userService.reset();
        angular.element('#login').modal('show');
      });
      $scope.$on('event:auth-loginConfirmed', function () {
        angular.element('#login').modal('hide');
      });

      $scope.checkAutoCompletion = function () {
        $timeout(function () {
          angular.element('#login input[type="password"]').trigger('input');
        }, 250);
      };
    }]);
  return module;
});