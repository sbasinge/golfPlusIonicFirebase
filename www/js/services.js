angular.module('golfplus.services', [])
  .factory('Pairings', Pairings)
  .factory('Scorecards', Scorecards)
  .factory('Members', Members)
  .factory('Teetimes', Teetimes)
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


function Scorecards() {
  var _nextId  = 7;
  var _scorecards = [];

  var service = {
    list: list,
    getById: getById,
    add: add

  };

  return service;


  function list() {
    return _scorecards;

  }

  function getById(scorecardId) {
    var scorecard = _.findWhere(list(),{id:+scorecardId});
    return  scorecard;
    //return $filter('getById')(list(), courseId);
  }

  function add(teetime, member) {
    var course = teetime.course;
    var newScorecard = {id: _nextId, courseId: teetime.courseId, memberId: member.id, scores:[]};
    _.each(course.holes,function(hole){
      newScorecard.scores.push({holeNumber: hole.holeNumber, handicap: hole.handicap, par: hole.par});
    });
    _nextId++;
    _scorecards.push(newScorecard);
    return newScorecard;
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
      {id: 3, firstName: 'Steve', lastName: 'Hawley', handicap: 20, avatar:''},
      {id: 4, firstName: 'Jeff', lastName: 'McCorkle', handicap: 20, avatar:''},
      {id: 5, firstName: 'Scott', lastName: 'Kern', handicap: 20, avatar:''},
      {id: 6, firstName: 'Scott', lastName: 'Basinger', handicap: 20, avatar:''},
    ];

  }

  function getById(memberId) {
    return _.findWhere(list(),{id:+memberId});
  }

}
function Teetimes() {
  var service = {
    list: list,
    getById: getById,
    findAllByCourseId: findAllByCourseId
  };

  return service;

  function list() {
    return [
      {id: 1, courseId: 1, date: new Date().toISOString(), time: '9am'},
      {id: 2, courseId: 2, date: new Date().toISOString(), time: '9am'},
      {id: 3, courseId: 3, date: new Date().toISOString(), time: '9am'},
      {id: 4, courseId: 4, date: new Date().toISOString(), time: '9am'}
    ];

  }

  function getById(teetimeId) {
    return _.findWhere(list(),{id:+teetimeId});
  }

  function findAllByCourseId(courseId) {
    return _.where(list(),{courseId: +courseId})
  }
}
;
