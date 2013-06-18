require.config({
  paths: {
    'css': '../components/require-css/css',
    'css-builder': '../components/require-css/css-builder',
    'normalize': '../components/require-css/normalize',

    underscore: '../components/underscore/underscore',
    jquery: '../components/jquery/jquery',

    'bootstrap': '../components/components-bootstrap/css/bootstrap',
    'bootstrap-responsive': '../components/components-bootstrap/css/bootstrap-responsive',
    'bootstrap-js': '../components/components-bootstrap/js/bootstrap',
    'font-awesome': '../components/components-font-awesome/css/font-awesome',

    'jquery-ui': '../components/jquery-ui/ui/jquery-ui',
    'jquery-ui-bootstrap': '../components/jquery-ui-bootstrap/jquery.ui.theme',
    'jquery-ui-bootstrap-font-awesome': '../components/jquery-ui-bootstrap/jquery.ui.theme.font-awesome',

    angular: '../components/angular/angular',
    'angular-resource': '../components/angular-resource/angular-resource',
    'restangular': '../components/restangular/dist/restangular',

    'select2': '../components/select2/select2',
    'select2-css': '../components/select2/select2',
    'angular-ui': '../components/angular-ui/build/angular-ui',
    'angular-ui-css': '../components/angular-ui/build/angular-ui',
    'angular-ui-bootstrap': '../components/angular-ui-bootstrap-bower/ui-bootstrap-tpls'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },

    'bootstrap-responsive': {
      deps: ['css!bootstrap']
    },
    'font-awesome': {
      deps: ['css!bootstrap']
    },
    'bootstrap-js': {
      deps: ['jquery', 'css!bootstrap', 'css!bootstrap-responsive', 'css!font-awesome']
    },

    'jquery-ui': {
      deps: ['jquery']
    },
    'jquery-ui-bootstrap': {
      deps: ['jquery-ui', 'css!bootstrap']
    },
    'jquery-ui-bootstrap-font-awesome': {
      deps: ['jquery-ui-bootstrap', 'css!font-awesome']
    },

    angular: {
      deps: ['jquery'],
      exports: 'angular'
    },
    'angular-resource': {
      deps: ['angular']
    },

    select2: {
      deps: ['jquery', 'css!select2-css'],
      exports: 'Select2'
    },
    'angular-ui': {
      deps: ['angular', 'css!angular-ui-css']
    },
    'angular-ui-bootstrap': {
      deps: ['angular', 'bootstrap-js']
    }
  }
});

require(['angular', 'app'], function (angular) {
  'use strict';

  angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);

    // Because of RequireJS we need to bootstrap the app app manually
    // and Angular Scenario runner won't be able to communicate with our app
    // unless we explicitely mark the container as app holder
    // More info: https://groups.google.com/forum/#!msg/angular/yslVnZh9Yjk/MLi3VGXZLeMJ
    var $html = angular.element('html');
    $html.addClass('ng-app');
  });
});