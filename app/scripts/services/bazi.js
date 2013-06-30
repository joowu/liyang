define(['underscore', 'services/module'], function (_, services) {
  'use strict';

  services.service('bazi', function () {
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var BASE_DAY = new Date(1900, 1, 20).getTime();

    var TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    var calculate = function (time, jie) {
      var ofYear = [tianGanOfYear(jie), diZhiOfYear(jie)];
      var ofMonth = [tianGanOfMonth(jie), diZhiOfMonth(jie)];
      var allOfDay = ganZhiOfDay(time);
      var ofDay = [tianGanOfDay(allOfDay), diZhiOfDay(allOfDay)];
      var ofTime = [tianGanOfHour(ofDay[0], time), diZhiOfHour(time)];

      return _.map([ofYear, ofMonth, ofDay, ofTime], function (item) {
        return [TIAN_GAN[item[0]], DI_ZHI[item[1]]];
      });
    };

    //公元4年为甲子年
    var tianGanOfYear = function (jie) {
      return (jie.year - 4) % TIAN_GAN.length;
    };
    var diZhiOfYear = function (jie) {
      return (jie.year - 4) % DI_ZHI.length;
    };

    //月干通过年干推算
    var tianGanOfMonth = function (jie) {
      return ((jie.year + 1) * 2 + jie.month + 1) % TIAN_GAN.length;
    };
    //月支和节气中的节匹配
    var diZhiOfMonth = function (jie) {
      return (jie.month + 1) % DI_ZHI.length;
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

    var tianGanOfHour = function (tianGanOfDay, time) {
      var zhiOfHour = diZhiOfHour(time);
      if (time.hours >= 23) {
        tianGanOfDay = tianGanOfDay + 1;
      }
      return ((tianGanOfDay % Math.floor(TIAN_GAN.length / 2)) * 2 + zhiOfHour) % TIAN_GAN.length;
    };
    var diZhiOfHour = function (time) {
      return Math.floor((time.hours + 1) / 2) % DI_ZHI.length;
    };

    return {calculate: calculate};
  });
});