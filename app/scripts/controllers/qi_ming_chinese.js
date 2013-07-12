define(['angular', 'controllers/module'], function (angular, controllers) {
  'use strict';

  controllers.controller('QiMingChineseCtrl', ['$scope', 'Jie', 'bazi', 'ChineseName',
    function ($scope, Jie, bazi, ChineseName) {
      $scope.name = {
        danming: false,
        bihui: '',
        bihu: '',
        ming1: '',
        ming2: '',

        chars: [
          {},
          {}
        ],
        xywx: true,
        rd: true,
        tr: true,
        td: true
      };

      $scope.calculate = function () {
        var time = {
          year: parseInt($scope.birthday.substr(0, 4), 10),
          month: parseInt($scope.birthday.substr(4, 2), 10),
          day: parseInt($scope.birthday.substr(6, 2), 10),
          hour: parseInt($scope.birthday.substr(8, 2), 10),
          minute: parseInt($scope.birthday.substr(10, 2), 10)
        };

        Jie.get({time: $scope.birthday}, function (jie) {
          var result = bazi.calculate(time, jie);
          $scope.bazi = result.bazi;
          $scope.lishu = [];
          for (var i = 0; i < result.lishu.length / 2; i++) {
            $scope.lishu.push([result.lishu[i * 2], result.lishu[i * 2 + 1]]);
          }
        });
      };

      $scope.qiming = function () {
        ChineseName.save($scope.name, function (names) {
          var characters = {};
          angular.forEach(names.characters, function (character) {
            characters[character.hz] = character;
          });
          names.characters = characters;
          $scope.names = names;
        });
      };
    }]);
});