define(['models/module'], function (models) {
  'use strict';

  models.factory('Thing', ['appConfig', '$resource',
    function (appConfig, $resource) {
      return $resource(appConfig.pathOfApi + 'things/:id', {id: '@id'});
    }]);
});