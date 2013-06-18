define(['commons/module'], function (commons) {
  'use strict';

  commons.config(['appConfig', function(appConfig) {
    appConfig.menu = [];
    appConfig.helpUrl = '';
  }]);

  commons.run(['$rootScope', '$location', function ($scope, $location) {
    $scope.isActiveMenu = function (menu) {
      return $location.url().indexOf(menu.url) === 0;
    };
  }]);
});