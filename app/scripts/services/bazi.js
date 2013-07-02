define(['underscore', 'services/module'], function (_, services) {
  'use strict';

  services.service('bazi', function () {
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var BASE_DAY = new Date(1910, 12 - 1, 24).getTime();

    var TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    var calculate = function (time, jie) {
      var ofYear = [tianGanOfYear(jie.year), diZhiOfYear(jie.year)];
      var ofMonth = [tianGanOfMonth(ofYear[0], jie.month), diZhiOfMonth(jie.month)];
      var allOfDay = ganZhiOfDay(time);
      var ofDay = [tianGanOfDay(allOfDay), diZhiOfDay(allOfDay)];
      var ofTime = [tianGanOfHour(ofDay[0], time.hour), diZhiOfHour(time.hour)];

      return _.map([ofYear, ofMonth, ofDay, ofTime], function (item) {
        return [TIAN_GAN[(item[0] + 9) % TIAN_GAN.length], DI_ZHI[(item[1] + 11) % DI_ZHI.length ]];
      });
    };

    //公元4年为甲子年
    var tianGanOfYear = function (year) {
      return (year - 3) % TIAN_GAN.length;
    };
    var diZhiOfYear = function (year) {
      return (year - 3) % DI_ZHI.length;
    };

    //月干通过年干推算
    var tianGanOfMonth = function (tianGanOfYear, month) {
      return ((tianGanOfYear % Math.floor(TIAN_GAN.length / 2)) * 2 + month) % TIAN_GAN.length;
    };
    //月支和节气中的节匹配
    var diZhiOfMonth = function (month) {
      return (month + 2) % DI_ZHI.length;
    };


    //日干支以公元1900年3月1号为基数
    var ganZhiOfDay = function (time) {
      var now = new Date(time.year, time.month - 1, time.day).getTime();
      return Math.round((now - BASE_DAY) / ONE_DAY);
    };
    var tianGanOfDay = function (ganZhiOfDay) {
      return ganZhiOfDay % TIAN_GAN.length;
    };
    var diZhiOfDay = function (ganZhiOfDay) {
      return ganZhiOfDay % DI_ZHI.length;
    };

    var tianGanOfHour = function (tianGanOfDay, hour) {
      return ((tianGanOfDay % Math.floor(TIAN_GAN.length / 2)) * 2 + Math.floor((hour + 3) / 2) + 8) % TIAN_GAN.length;
    };
    var diZhiOfHour = function (hour) {
      return Math.floor((hour + 3) / 2) % DI_ZHI.length;
    };

    return {calculate: calculate};
  });
});