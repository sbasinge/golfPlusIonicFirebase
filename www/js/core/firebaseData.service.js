(function() {
  'use strict';

  angular
    .module('golfplus.core')
    .factory('firebaseDataService', firebaseDataService);

  firebaseDataService.$inject = ['FIREBASE_URL'];

  function firebaseDataService(FIREBASE_URL) {
    var root = new Firebase(FIREBASE_URL);

    return {
      root: root,
      members: root.child('members'),
      items: root.child('items'),
      courses: root.child('courses'),
      teetimes: root.child('teetimes'),
      pairings: root.child('pairings'),
      scorecards: root.child('scorecards')
    };

  }

})();
