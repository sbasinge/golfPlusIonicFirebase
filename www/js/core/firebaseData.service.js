(function() {
  'use strict';

  angular
    .module('golfplus.core')
    .factory('firebaseDataService', firebaseDataService);

  firebaseDataService.$inject = ['FIREBASE_URL'];

  function firebaseDataService(FIREBASE_URL) {
    var db = new Firebase(FIREBASE_URL);

    return {
      db: db,
      members: db.child('members'),
      items: db.child('items'),
      courses: db.child('courses'),
      teetimes: db.child('teetimes'),
      pairings: db.child('pairings'),
      scorecards: db.child('scorecards')
    };

  }

})();
