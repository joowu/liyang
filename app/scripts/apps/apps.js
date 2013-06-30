define(['apps/module', 'apps/chinese_name'], function (apps) {
  'use strict';

  apps.config(['appConfig', function (appConfig) {
    appConfig.name = '玄中居';
    appConfig.menu = [
        {
            name: '起名（中文）',
            url: '/name/chinese/qi'
        },
        {
            name: '解名（中文）',
            url: '/name/chinese/jie'
        },
        {
            name: '起名（英文）',
            url: '/name/english/qi'
        },
        {
            name: '解名（英文）',
            url: '/name/english/jie'
        },
        {
            name: '八字',
            url: '/ba_zi'
        },
        {
            name: '八卦',
            url: '/ba_gua'
        }
    ];
  }]);
});

