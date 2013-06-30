define(['services/module'], function (services) {
  'use strict';

  services.service('wuxing', function () {
    var YIN_YANG = [
      {
        name: '阴',
        value: 6
      },
      {
        name: '阳',
        value: 9
      }
    ];
    var WU_XING = [
      {
        name: '金',
        value: '金'
      },
      {
        name: '木',
        value: '木'
      },
      {
        name: '水',
        value: '水'
      },
      {
        name: '火',
        value: '火'
      },
      {
        name: '土',
        value: '土'
      }
    ];

    return {YIN_YANG: YIN_YANG, WU_XING: WU_XING};
  });
});