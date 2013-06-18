define(['angular', 'commons/commons', 'services/services', 'models/models', 'controllers/controllers'], function (angular) {
  'use strict';

  var module = angular.module('app.apps', ['app.commons', 'app.services', 'app.models', 'app.controllers']);
  module.constant('appsConfig', {
    pathOfView: 'views/'
  });
  return module;
});