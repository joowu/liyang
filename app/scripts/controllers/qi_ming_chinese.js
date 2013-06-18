define(['controllers/module'], function (controllers) {
  'use strict';

  controllers.controller('QiMingChineseCtrl', ['$scope', 'awesomeThings', function ($scope, awesomeThings) {
    $scope.awesomeThings = awesomeThings;
  }]);
});