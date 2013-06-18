define(['apps/module'], function (apps) {
  'use strict';

  apps.config(['appConfig', '$routeProvider', function (appConfig, $routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: appConfig.pathOfView + 'main.html',
        controller: 'MainCtrl',
        resolve: {
          awesomeThings: ['Thing', function(Thing) {
            return Thing.query();
          }]
        }
      });
  }]);
});
