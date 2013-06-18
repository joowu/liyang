define(['commons/module'], function (commons) {
  'use strict';

  commons.constant('appConfig', {
    pathOfView: 'views/',
    pathOfApi: 'api/'
  });

  commons.run(['$rootScope', 'appConfig', function ($scope, appConfig) {
    $scope.app = appConfig;
  }]);
});