'use strict';

/* Directives */


angular.module('golfplus')

  .directive('appVersion', ['version', function(version) {
    return function(scope, elm) {
      elm.text(version);
    };
  }]);
