'use strict';

describe('Home', function () {
  beforeEach(function () {
    browser().navigateTo('/');
  });

  it('should append hash', function () {
    expect(browser().location().url()).toBe('/');
  });
});