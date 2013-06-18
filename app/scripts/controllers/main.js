define(['controllers/module'], function (controllers) {
  'use strict';

  controllers.controller('MainCtrl', ['$scope', 'awesomeThings', function ($scope, awesomeThings) {
    $scope.awesomeThings = awesomeThings;
  }]);
});