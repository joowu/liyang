define(['angularMocks', 'controllers/main'], function () {
  'use strict';

  describe('Controller: MainCtrl', function () {
    beforeEach(module('app.controllers'));

    var awesomeThings = ["test"];
    var MainCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      MainCtrl = $controller('MainCtrl', {
        $scope: scope,
        awesomeThings: awesomeThings
      });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
      expect(scope.awesomeThings).toBe(awesomeThings);
    });
  });
});
