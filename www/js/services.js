angular.module('golfplus.services', [])
  .factory('Pairings', Pairings)
  .factory('Members', Members)
;

function Pairings() {
  var _nextPairingId = 3;
  var _pairings = [];

  var service = {
    list: list,
    findAllByTeetimeId: findAllByTeetimeId,
    add: add
  };

  return service;

  function list() {
    return _pairings;

  }

  function findAllByTeetimeId(teetimeId) {
    var pairings = _.where(list(),{teetimeId:+teetimeId});
    return  pairings;
    //return $filter('getById')(list(), courseId);
  }

  function add(newPairing) {
    newPairing.id = _nextPairingId;
    _nextPairingId++;
    _pairings.push(newPairing);
  }

}




function Members() {
  var service = {
    list: list,
    getById: getById
  };

  return service;

  function list() {
    return [
      {id: 1, firstName: 'Tom', lastName: 'Kirk', handicap: 20, avatar:''},
      {id: 2, firstName: 'Rich', lastName: 'Jenks', handicap: 20, avatar:''},
      {id: 3, firstName: 'Steve', lastName: 'Hawley', handicap: 8, avatar:''},
      {id: 4, firstName: 'Jeff', lastName: 'McCorkle', handicap: 14, avatar:''},
      {id: 5, firstName: 'Scott', lastName: 'Kern', handicap: 19, avatar:''},
      {id: 6, firstName: 'Scott', lastName: 'Basinger', handicap: 18, avatar:''},
    ];

  }

  function getById(memberId) {
    return _.findWhere(list(),{id:+memberId});
  }

}
;
