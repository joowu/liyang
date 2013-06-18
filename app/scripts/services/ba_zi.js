define(['services/module'], function (services) {
  'use strict';

  services.service('baZi', function () {
    var TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    var calculate = function (time) {
    };

    var getYear = function (time) {

    };

    //公元4年为甲子年
    var tianGanOfYear = function (year) {
      return (year - 4) % TIAN_GAN.length;
    };
    var diZhiOfYear = function (year) {
      return (year - 4) % DI_ZHI.length;
    };

    //月干通过年干推算
    var tianGanOfMonth = function (tianGanOfYear) {
      return (tianGanOfYear % (TIAN_GAN.length / 2) + 1) * 2;
    };
    //月支和节气中的节匹配
    var diZhiOfMonth = function (date, jieqiInYear) {
      return _.sortedIndex(jieqiInYear, date) - 1;
    };


    //日干支以公元1900年3月1号为基数
    var numberOfDaYue = function (month) {
      var monthFromMarch = ((n + 9) % 12) + 1;
      return (monthFromMarch + monthFromMarch / 6) / 2;
    };
    var ganZhiOfDay = function (year, month, day) {
      return ((year - 1900) * 5 + (year - 1900) / 4 + 9 + day + numberOfDaYue(month) - ((month + 1) % 2) * 30) % 60;
    };
    var tianGanOfDay = function (ganZhiOfDay) {
      return ganZhiOfDay % TIAN_GAN.length;
    };
    var diZhiOfDay = function (ganZhiOfDay) {
      return ganZhiOfDay % DI_ZHI.length;
    };

    var tianGanOfHour = function (tianGanOfYear) {
      return (tianGanOfYear % (TIAN_GAN.length / 2)) * 2;
    };
    var diZhiOfHour = function (hour) {
      return ((hour + 1) / 2) % 12;
    };

    return {calculate: calculate};
  });
});