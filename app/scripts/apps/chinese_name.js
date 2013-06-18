define(['apps/module'], function (apps) {
  'use strict';

  apps.config(['appsConfig', '$routeProvider', function (appsConfig, $routeProvider) {
    $routeProvider.when('/', {redirectTo: '/name/chinese/qi'});
    $routeProvider.when('/name/chinese/qi', {
        templateUrl: appsConfig.pathOfView + 'qi_ming_chinese.html',
        controller: 'QiMingChineseCtrl',
        resolve: {
          awesomeThings: ['Thing', function(Thing) {
            return Thing.query();
          }]
        }
      });
  }]);
});
