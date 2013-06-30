define(['models/module'], function (models) {
  'use strict';

  models.factory('ChineseName', ['appConfig', '$resource',
    function (appConfig, $resource) {
      return $resource(appConfig.pathOfApi + 'chinese_names');
    }]);
});