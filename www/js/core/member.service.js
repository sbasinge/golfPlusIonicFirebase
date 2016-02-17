(function() {
  'use strict';

  angular
    .module('golfplus.core')
    .factory('memberService', memberService);

  memberService.$inject = ['$firebaseArray', 'firebaseDataService'];

  function memberService($firebaseArray, firebaseDataService) {

    var members = null;

    return {
      Member: Member,
      reset: reset,
      list: list,
      findByName: findByName,
      existsByName: existsByName,
      add: add,
      exists: exists
    };

    ////////////

    function Member() {
      this.name = '';
      this.phone = '';
    }

    function list() {
      return $firebaseArray(firebaseDataService.members);
    }

    function findByName(name) {
      firebaseDataService.members.child()
    }

    function exists(uid) {
      return firebaseDataService.members.child(uid) !== null
    }

    function existsByName(name) {

    }

    function add(value) {
      $firebaseArrayfirebaseDataService.members.$add(value);
    }

    function reset() {
      if (members) {
        members.$destroy();
        members = null;
      }
    }

  }

})();
