define(['angular',
    'css!jquery-ui-bootstrap-font-awesome',
    'select2',
    'angular-ui',
    'angular-ui-bootstrap',
    'css!../../styles/main.css'
], function(angular) {
  'use strict';

  return angular.module('app.ui', ['ui', 'ui.bootstrap']);
});