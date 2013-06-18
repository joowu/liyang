define(['commons/module'], function (commons) {
  'use strict';

  commons.config(['appConfig', function(appConfig) {
    appConfig.excludedUriForMessage = [];
  }]);

  commons.factory('messageService', function () {
    return {
      message: null,
      setMessage: function (content, type) {
        this.message = {content: content, type: type};
      },
      clear: function () {
        this.message = null;
      }
    };
  });

  commons.config(['$httpProvider', function ($httpProvider) {
    var messageHttpInterceptor = ['$q', '$rootScope', 'appConfig', 'messageService', function ($q, $rootScope, appConfig, messageService) {
      return function (promise) {
        var property = {
          data: '_data',
          message: '_message'
        };
        var verbs = {
          GET: ['view'],
          POST: ['create', 'created'],
          PUT: ['modify', 'saved'],
          DELETE: ['delete', 'deleted']
        };

        function isExcluded(uri) {
          for(var i = 0; i < appConfig.excludedUriForMessage.length; i++) {
            var excludedUri = appConfig.excludedUriForMessage[i];
            if (uri.substring(0, excludedUri.length) === excludedUri) {
              return true;
            }
          }

          return false;
        }

        function getResourceName(response) {
          var segments = response.config.url.split('/');
          var segment = (parseInt(segments[segments.length - 1], 10) > 0) ? segments[segments.length - 2] : segments[segments.length - 1];
          if (parseInt(segments[segments.length - 2], 10) > 0) {
          } else {
            segment = segment.substring(0, segment.length - 1);
          }
          return segment.split('_').join(' ');
        }

        function success(response) {
          if (response.data[property.message]) {
            console.log(response.data[property.message].forDeveloper);
            messageService.setMessage(response.data[property.message].forUser, 'success');
          } else if (!isExcluded(response.config.url) ){
            var resourceName = getResourceName(response);
            var method = response.config.method.toUpperCase();
            var verb = verbs[method];
            if (verb && verb[1]) {
              var message = 'The ' + resourceName + ' has been ' + verb[1];
              if (method === 'DELETE') {
                var url = response.config.url;
                var id = url.substring(url.lastIndexOf('/') + 1);
                if (id.substring(0, 1) === '-') {
                  message = null;
                } else {
                  message += ' <a ng-click="undelete(' + id + ')">Undo</a>';
                }
              }
              if (message) {
                messageService.setMessage(message, 'success');
              } else {
                messageService.clear();
              }
            }
          }
          if (response.data[property.data]) {
            response.data = response.data[property.data];
          }
          return response;
        }

        function fail(response) {
          var messageForDeveloper;
          var messageForUser;

          if (response.data[property.message]) {
            messageForDeveloper = response.data[property.message].forDeveloper;
            messageForUser = response.data[property.message].forUser;
          } else if (response.status >= 400 && response.status < 500) {
            switch (response.status) {
            case 401:
              break;
            case 403:
              messageForUser = 'You don\'t have the permission to ' + verbs[response.config.method.toUpperCase()][0] + ' the ' + getResourceName(response);
              break;
            case 404:
              messageForUser = 'The ' + getResourceName(response) + ' cannot be found';
              break;
            default:
              messageForDeveloper = response.data;
              messageForUser = 'Ops, there is something wrong.';
            }
          } else if (response.status >= 500) {
            messageForDeveloper = response.data;
            messageForUser = 'Ops, we met an error on server.';
          }

          if (messageForDeveloper) {
            console.log(messageForDeveloper);
          }
          if (messageForUser) {
            messageService.setMessage(messageForUser, 'error');
          }
          return $q.reject(response);
        }

        return promise.then(success, fail);
      };
    }];

    $httpProvider.responseInterceptors.push(messageHttpInterceptor);
  }]);

  commons.directive('globalMessage', ['$parse', '$compile', 'messageService', function ($parse, $compile, messageService) {
    return {
      restrict: 'A',
      template: '<div class="alert alert-{{message.type}}" ng-show="message">' +
          '<button class="close" href="#" ng-click="hideMessage()">&times;</button>' +
          '<span ng-bind-html-unsafe="message.content"></span>' +
          '</div>',
      link: function (scope) {
        scope.message = null;
        scope.messageService = messageService;

        scope.$watch('messageService.message', function (newVal) {
          scope.message = newVal;
          if (scope.message && scope.message.content) {
            scope.message.content = $compile('<span>' + scope.message.content + '</span>')(scope);
          }
        });

        scope.hideMessage = function () {
          scope.message = null;
          // Also clear the error message on the bound variable.
          // Do this so that if the same error happens again
          // the alert bar will be shown again next time.
          messageService.clear();
        };
      }
    };
  }]);
});