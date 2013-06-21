define(['models/module'], function (models) {
  'use strict';

  models.factory('Jie', ['appConfig', '$resource',
    function (appConfig, $resource) {
      return $resource(appConfig.pathOfApi + 'jies/:time');
    }]);
});