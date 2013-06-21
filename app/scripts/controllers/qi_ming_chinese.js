define(['controllers/module'], function (controllers) {
  'use strict';

  controllers.controller('QiMingChineseCtrl', ['$scope', 'Jie', 'bazi',
    function ($scope, Jie, bazi) {
      $scope.calculate = function () {
        var time = {
          year: parseInt($scope.birthday.substr(0, 4)),
          month: parseInt($scope.birthday.substr(4, 2)),
          day: parseInt($scope.birthday.substr(6, 2)),
          hours: parseInt($scope.birthday.substr(8, 2)),
          minutes: parseInt($scope.birthday.substr(10, 2))};

        Jie.get({time: $scope.birthday}, function (jie) {
          $scope.bazi = bazi.calculate(time, jie);
        });
      };
    }]);
});