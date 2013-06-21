define(['angular', 'commons/module', 'commons/auth'], function (angular, commons) {
  'use strict';

  commons.factory('userService', ['$rootScope', '$http', 'authService', '$route', 'appConfig', 'messageService',
    function ($scope, $http, authService, $route, appConfig, messageService) {

      appConfig.uriForUsers = angular.extend({
        current: appConfig.pathOfApi + 'users/current',
        login: appConfig.pathOfApi +'users/login',
        logout: appConfig.pathOfApi +'users/logout'
      }, appConfig.uriForUsers || []);

      appConfig.excludedUriForMessage.push(appConfig.pathOfApi + 'users');

      var properties = {};
      properties.user = {};

      $http.get(appConfig.uriForUsers.current)
          .success(function (data) {
            angular.copy(data, properties.user);
          });

      properties.login = function () {
        delete properties.message;
        messageService.clear();

        $http.post(appConfig.uriForUsers.login, properties.user, {ignoreAuthModule: true})
            .success(function () {
              $http.get(appConfig.uriForUsers.current)
                  .success(function (data) {
                    angular.copy(data, properties.user);
                    authService.loginConfirmed();
                  });
            }).error(function() {
              properties.message = messageService.message.content;
            });
      };
      properties.logout = function () {
        $http.post(appConfig.uriForUsers.logout, {})
            .success(function () {
              properties.reset();
              $route.reload();
            });
      };
      properties.reset = function () {
        properties.user = {};
      };
      return properties;
    }]);

  commons.filter('hasRole', ['$rootScope', 'userService',
    function ($scope, userService) {
      return function (role) {
        return userService.user && userService.user.roles && userService.user.roles.indexOf(($scope.app.roles || {})[role] || role) >= 0;
      };
    }]);

  commons.filter('logon', ['userService',
    function (userService) {
      return function (user) {
        return user && userService.user.userName === '' + (user.userName || user);
      };
    }]);
});