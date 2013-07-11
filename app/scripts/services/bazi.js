define(['underscore', 'angular', 'services/module'], function (_, angular, services) {
  'use strict';

  services.service('bazi', function () {
    var TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    var calculate = function (time, jie) {
      var bazi = calculateBazi(time, jie);
      var lishu = calculateLishu(bazi);
      bazi.reverse();
      return {
        bazi: _.map(bazi, function (item) {
          return [TIAN_GAN[item[0] - 1], DI_ZHI[item[1] -1]];
        }),
        lishu: _.map(lishu, function (lishu, index) {
          return [TIAN_GAN[index], lishu];
        })
      };
    };

    var ONE_DAY = 1000 * 60 * 60 * 24;
    var BASE_DAY = new Date(1910, 12 - 1, 24).getTime();
    var calculateBazi = function (time, jie) {
      var ofYear = [tianGanOfYear(jie.year), diZhiOfYear(jie.year)];
      var ofMonth = [tianGanOfMonth(ofYear[0], jie.month), diZhiOfMonth(jie.month)];
      var allOfDay = ganZhiOfDay(time);
      var ofDay = [tianGanOfDay(allOfDay), diZhiOfDay(allOfDay)];
      var ofTime = [tianGanOfHour(ofDay[0], time.hour), diZhiOfHour(time.hour)];
      return _.map([ofYear, ofMonth, ofDay, ofTime], function(items) {
        return [items[0] ? items[0] : TIAN_GAN.length, items[1] ? items[1] : DI_ZHI.length];
      });
    };

    var TIAN_GAN_WU_XING = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
    var DI_ZHI_WU_XING = [0, 5, 3, 1, 1, 3, 2, 2, 3, 4, 4, 3, 5];
    var TIAN_GAN_BEN_QI = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var DI_ZHI_BEN_QI = [0, 10, 6, 1, 2, 5, 3, 4, 6, 7, 8, 5, 9];

    var ALL_ZERO = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var TIAN_GAN_LI_SHU = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
      console.log('bazi: ' + bazi);
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
      console.log('initial: ' + angular.toJson(lishus));

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
      console.log('after basic zuoji and xinding lishu: ' + angular.toJson(lishus));

      //fangju lishu computation
      var hasSanhui = false;
      _.each([
        [0, 1, 2],
        [0, 1, 3],
        [0, 2, 3],
        [1, 2, 3]
      ], function (positions) {
        var dizhis = extractDizhis(lishus, positions);
        if (calculateSanhui(dizhis)) {
          hasSanhui = true;
          var sanhui = calculateSanhe(dizhis);
          if (matchWuxing(lishus, positions, sanhui)) {
            setBase(lishus, positions, sanhui, 18);
          } else {
            useBenqi(lishus, positions);
          }
        }
      });
      console.log('after fangju lishu: ' + angular.toJson(lishus));

      //fangju huitu
      var positions = _.range(0, 3);
      var dizhis = extractDizhis(lishus, positions);
      if (_.isEmpty(_.without(dizhis, [2, 5, 8, 11]))) {
        hasSanhui = true;
        var sanhui = 3;
        if (matchWuxing(lishus, positions, sanhui)) {
          setBase(lishus, positions, sanhui, 13);
        } else {
          useBenqi(lishus, positions);
        }
      }
      console.log('after fangju huitu: ' + angular.toJson(lishus));

      //guaju lishu computation
      var hasSanhe = false;
      _.each([
        [0, 1, 2],
        [0, 1, 3],
        [0, 2, 3],
        [1, 2, 3]
      ], function (positions) {
        var dizhis = extractDizhis(lishus, positions);
        var sanhe = calculateSanhe(dizhis);
        if (sanhe) {
          hasSanhe = true;
          if (matchWuxing(lishus, positions, sanhe)) {
            setBase(lishus, positions, sanhe, 12);
          } else {
            useBenqi(lishus, positions);
          }
        }
      });
      console.log('after guaju lishu: ' + angular.toJson(lishus));

      if (!hasSanhui && !hasSanhe) {
        //banguaju lishu computation
        var bansanhes = _.map([
          [0, 1],
          [1, 2],
          [2, 3]
        ], function (positions) {
          var dizhis = extractDizhis(lishus, positions);
          return calculateBansanhe(dizhis);
        });
        if (bansanhes[0] && bansanhes[1] && bansanhes[2]) {
          if (matchWuxing(lishus, [0, 1], bansanhes[0])) {
            setBase(lishus, positions, sanhui, 10);
          } else {
            useBenqi(lishus, positions);
          }
          if (matchWuxing(lishus, [1, 2], bansanhes[0])) {
            setBase(lishus, positions, sanhui, 10);
          } else {
            useBenqi(lishus, positions);
          }
        } else if (bansanhes[0] && !bansanhes[1]) {
          if (matchWuxing(lishus, [0, 1], bansanhes[0])) {
            setBase(lishus, positions, sanhui, 10);
          } else {
            useBenqi(lishus, positions);
          }
        } else if (bansanhes[1] && !bansanhes[2]) {
          if (matchWuxing(lishus, [1, 2], bansanhes[1])) {
            setBase(lishus, positions, sanhui, 10);
          } else {
            useBenqi(lishus, positions);
          }
        } else if (bansanhes[2]) {
          if (matchWuxing(lishus, [2, 3], bansanhes[2])) {
            setBase(lishus, positions, sanhui, 10);
          } else {
            useBenqi(lishus, positions);
          }
        }
        console.log('after banguaju lishu: ' + angular.toJson(lishus));

        //zhichong zhihe lishu adjustment
        _.each([
          [0, 1],
          [1, 2],
          [2, 3]
        ], function (positions) {
          var dizhis = extractDizhis(lishus, positions);
          if (isZhichong(dizhis)) {
            _.each(positions, function (position) {
              var dizhi = lishus[position].dizhi;
              dizhi.lishu[dizhi.benqi] = Math.floor(dizhi.lishu[dizhi.benqi] / 2);
            });
          }
          if (isZhihe(dizhis)) {
            _.each(positions, function (position) {
              var dizhi = lishus[position].dizhi;
              dizhi.lishu[dizhi.benqi] = Math.floor(dizhi.lishu[dizhi.benqi] * 3 / 2);
            });
          }
        });
        console.log('after zhichong zhihe lishu adjustment: ' + angular.toJson(lishus));
      }

      var result = angular.copy(ALL_ZERO);
      _.each(lishus, function (item) {
        _.each(item.tiangan.lishu, function (lishu, index) {
          result[index] += lishu;
        });
        _.each(item.dizhi.lishu, function (lishu, index) {
          result[index] += lishu;
        });
      });

      return _.rest(result);
    };

    var useBenqi = function (lishus, positions) {
      _.each(positions, function (position) {
        var benqi = lishus[position].dizhi.lishu[lishus[position].dizhi.benqi];
        lishus[position].dizhi.lishu = angular.copy(ALL_ZERO);
        lishus[position].dizhi.lishu[lishus[position].dizhi.benqi] = benqi;
      });
    };
    var setBase = function (lishus, positions, sanhui, base) {
      _.each(positions, function (position) {
        lishus[position].dizhi.lishu = angular.copy(ALL_ZERO);
        lishus[position].dizhi.lishu[2 * sanhui] = base;
        lishus[position].dizhi.lishu[2 * sanhui - 1] = base;
      })
    };
    var extractDizhis = function (lishus, positions) {
      return _.map(positions, function (position) {
        return lishus[position].dizhi.position;
      });
    };
    var matchWuxing = function (lishus, positions, sanhui) {
      return _.some(positions, function (position) {
        return lishus[position].tiangan.wuxing === sanhui;
      });
    };
    var calculateSanhui = function (dizhis) {
      var numbers = _.map(dizhis,function (dizhi) {
        return dizhi % 12;
      }).sort();

      return numbers[0] % 3 === 0 && numbers[1] === numbers[0] + 1 && numbers[2] === numbers[0] + 2;
    };
    var calculateSanhe = function (dizhis) {
      var numbers = _.uniq(_.map(dizhis, function (dizhi) {
        return dizhi % 4;
      }));

      if (numbers.length === 1) {
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
    var calculateBansanhe = function (dizhis) {
      if (dizhis[0] === dizhis[1]) {
        return 0;
      }
      if (_.without([1, 10, 7, 4], dizhis).length === 4) {
        return 0;
      }
      return calculateSanhe(dizhis);
    }
    var isZhichong = function (dizhis) {
      return ((dizhis[0] + 6) % 12) === (dizhis[1] % 12);
    };
    var isZhihe = function (dizhis) {
      return (dizhis[0] + dizhis[1] === 15) || (dizhis[0] + dizhis[1] === 3);
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