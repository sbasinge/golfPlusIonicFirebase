'use strict';

/* Filters */

angular.module('golfplus')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });
