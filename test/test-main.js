var tests = Object.keys(window.__karma__.files).filter(function (file) {
  return /\/spec\//.test(file);
});

requirejs.config({
  baseUrl: '/base/app/scripts',
  paths: {
    domReady: '../components/requirejs-domready/domReady',
    underscore: '../components/underscore/underscore',
    angular: '../components/angular/angular',
    angularResource: '../components/angular-resource/angular-resource',
    angularMocks: '../components/angular-mocks/angular-mocks'
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    angularResource: {
      deps: ['angular']
    },
    angularMocks: {
      deps: ['angularResource']
    }
  },
  deps: tests,
  callback: window.__karma__.start
});