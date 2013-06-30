define(['angular', 'controllers/module'], function (angular, controllers) {
  'use strict';

  controllers.controller('QiMingChineseCtrl', ['$scope', 'Jie', 'bazi', 'ChineseName',
    function ($scope, Jie, bazi, ChineseName) {
      $scope.name = {
        danming: false,
        bihui: "",
        bihu: "",
        chars: [{}, {}],
        xywx: true,
        jie_rd: true,
        jie_tr: true,
        jie_td: true
      }

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

      $scope.qiming = function () {
        ChineseName.save($scope.name, function(names) {
          var characters = {};
          angular.forEach(names.characters, function(character) {
            characters[character.hz] = character;
          });
          names.characters = characters;
          $scope.names = names;
        });
      }
    }]);
});