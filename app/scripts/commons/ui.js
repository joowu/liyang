define(['angular',
  'css!jquery-ui-bootstrap-font-awesome',
  'select2',
  'angular-ui',
  'angular-ui-bootstrap',
  'css!../../styles/common.css',
  'css!../../styles/app.css'
], function (angular) {
  'use strict';

  var module = angular.module('app.ui', ['ui', 'ui.bootstrap']);

  angular.element(document).on('shown', '.modal', function () {
    angular.element('[autofocus]', this).focus();
  });

  return module;
});