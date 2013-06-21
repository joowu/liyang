define(['commons/config', 'commons/message', 'commons/menu', 'commons/user'], function() {
  'use strict';

  Date.prototype.toJSON = function () {
    function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
    }

    var offset = this.getTimezoneOffset();
    return this.getFullYear() +
        '-' + f(this.getMonth() + 1) +
        '-' + f(this.getDate()) +
        'T' + f(this.getHours()) +
        ':' + f(this.getMinutes()) +
        ':' + f(this.getSeconds()) +
        (offset > 0 ? '-' : '+') +
        f(Math.floor(Math.abs(offset) / 60)) + f(Math.abs(offset) % 60);
  };
});