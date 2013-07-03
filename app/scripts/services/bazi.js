define(['underscore', 'angular', 'services/module'], function (_, angular, services) {
  'use strict';

  services.service('bazi', function () {
    var TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    var calculate = function (time, jie) {
      var bazi = calculateBazi(time, jie);
      return _.map(bazi, function (item) {
        return [TIAN_GAN[(item[0] + 9) % TIAN_GAN.length], DI_ZHI[(item[1] + 11) % DI_ZHI.length ]];
      });
    };

    var ONE_DAY = 1000 * 60 * 60 * 24;
    var BASE_DAY = new Date(1910, 12 - 1, 24).getTime();
    var calculateBazi = function (time, jie) {
      var ofYear = [tianGanOfYear(jie.year), diZhiOfYear(jie.year)];
      var ofMonth = [tianGanOfMonth(ofYear[0], jie.month), diZhiOfMonth(jie.month)];
      var allOfDay = ganZhiOfDay(time);
      var ofDay = [tianGanOfDay(allOfDay), diZhiOfDay(allOfDay)];
      var ofTime = [tianGanOfHour(ofDay[0], time.hour), diZhiOfHour(time.hour)];
      return [ofYear, ofMonth, ofDay, ofTime];
    };

    var TIAN_GAN_WU_XING = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
    var DI_ZHI_WU_XING = [0, 5, 3, 1, 1, 3, 2, 2, 3, 4, 4, 3, 5];
    var TIAN_GAN_BEN_QI = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var DI_ZHI_BEN_QI = [0, 10, 6, 1, 2, 5, 3, 4, 6, 7, 8, 5, 9];

    var ALL_ZERO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var TIAN_GAN_LI_SHU = [
      [0, 36, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 36, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 36, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 36, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 36, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36]
    ];
    var DI_ZHI_LI_SHU = [
      [0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 27],
      [0, 0, 0, 0, 0, 0, 10, 6, 3, 3, 6],
      [0, 22, 0, 8, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 27, 3, 0, 0, 0, 0, 0, 0, 0],
      [0, 3, 6, 0, 0, 13, 0, 5, 0, 0, 3],
      [0, 0, 0, 22, 0, 5, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 27, 0, 3, 0, 0, 0, 0],
      [0, 0, 3, 3, 6, 0, 20, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 22, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 27, 3, 0],
      [0, 0, 0, 0, 3, 18, 0, 3, 6, 0, 0],
      [0, 8, 0, 0, 0, 0, 0, 0, 0, 22, 0]
    ];

    var calculateLishu = function (bazi) {
      var lishus = _.map(bazi, function (item) {
        return {
          tiangan: {
            position: item[0],
            benqi: TIAN_GAN_BEN_QI[item[0]],
            wuxing: TIAN_GAN_WU_XING[item[0]],
            lishu: angular.copy(TIAN_GAN_LI_SHU[item[0]])
          },
          dizhi: {
            position: item[1],
            benqi: DI_ZHI_BEN_QI[item[1]],
            wuxing: DI_ZHI_WU_XING[item[1]],
            lishu: angular.copy(DI_ZHI_LI_SHU[item[1]])
          }
        }
      });

      //basic zuoji and xinding lishu computation
      _.each(lishus, function (item, index) {
        switch ((item.tiangan.wuxing + 5 - item.dizhi.wuxing) % 5) {
          case 4:
            item.tiangan.lishu[item.tiangan.benqi] -= 8;
            item.dizhi.lishu[item.dizhi.benqi] += 8;
            break;
          case 3:
            item.tiangan.lishu[item.tiangan.benqi] -= 16;
            item.dizhi.lishu[item.dizhi.benqi] = Math.floor(item.dizhi.lishu[item.dizhi.benqi] * 2 / 3);
            break;
          case 2:
            item.tiangan.lishu[item.tiangan.benqi] -= 24;
            break;
          case 0:
            item.tiangan.lishu[item.tiangan.benqi] += 8;
            item.dizhi.lishu[item.dizhi.benqi] += 16;
            break;
          default:
        }

        var yifu = (item.tiangan.wuxing === item.dizhi.wuxing)
            || ((item.tiangan.wuxing + 5 - item.dizhi.wuxing) % 5 === 1);
        if (index === 2) {
          yifu = yifu || (item.tiangan.wuxing === lishus[index - 1].dizhi.wuxing)
              || ((item.tiangan.wuxing + 5 - lishus[index - 1].dizhi.wuxing) % 5 === 1)
        }
        if (!yifu) {
          item.tiangan.lishu[item.tiangan.position] = 8;
        }
      });

      //fangju lishu computation
      _.each([
        [0, 1, 2],
        [0, 1, 3],
        [0, 2, 3],
        [1, 2, 3]
      ], function (positions) {
        var dizhis = _.map(positions, function (position) {
          return lishus[position].dizhi.position;
        });
        if (sanhui(dizhis)) {
          var wx_sanhui = sanhe(dizhis);
          _.each(positions, function (position) {
            if (_.some(positions, function (position) {
              return lishus[position].tiangan.wuxing === wx_sanhui;
            })) {
              lishus[position].dizhi.lishu = angular.copy(ALL_ZERO);
              lishus[position].dizhi.lishu[2 * wx_sanhui] = 18;
              lishus[position].dizhi.lishu[2 * wx_sanhui - 1] = 18;
            } else {
              var benqi = lishus[position].dizhi.lishu[lishus[position].dizhi.benqi];
              lishus[position].dizhi.lishu = angular.copy(ALL_ZERO);
              lishus[position].dizhi.lishu[lishus[position].dizhi.benqi] = benqi;
            }
          });
        }
      });
    };

    var sanhui = function (dizhis) {
      var numbers = _.map(dizhis,function (dizhi) {
        return dizhi % 12;
      }).sort();

      return numbers[0] % 3 === 0 && numbers[1] === numbers[0] + 1 && numbers[2] === numbers[0] + 2;
    };

    var sanhe = function (dizhis) {
      var numbers = _.map(dizhis, function (dizhi) {
        return dizhi % 4;
      });

      if (numbers[0] === numbers[1] && numbers[1] === numbers[2]) {
        switch (numbers[0]) {
          case 0:
            return 1;
          case 1:
            return 5;
          case 2:
            return 4;
          case 3:
            return 2;
        }
      }

      return 0;
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