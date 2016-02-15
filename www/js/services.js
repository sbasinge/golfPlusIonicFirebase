angular.module('starter.services', [])
.factory('Courses', Courses)
  .factory('Pairings', Pairings)
  //.factory('Scorecards', Scorecards)
  .factory('Members', Members)
  .factory('Teetimes', Teetimes)
;

function Courses() {
  var service = {
    list: list,
    getById: getById
  };

  return service;

  function list() {
    return [
      {name: 'Leopards Chase', id: 1, teesets:[{name: 'white', slope:123, courseRating:71.3}], holes:[{holeNumber:1,par:4,handicap:1},{holeNumber:2,par:4,handicap:1},{holeNumber:3,par:4,handicap:1},{holeNumber:4,par:4,handicap:1},{holeNumber:5,par:4,handicap:1},{holeNumber:6,par:4,handicap:1},{holeNumber:7,par:4,handicap:1},{holeNumber:8,par:4,handicap:1},{holeNumber:9,par:4,handicap:1},{holeNumber:10,par:4,handicap:1},{holeNumber:11,par:4,handicap:1},{holeNumber:12,par:4,handicap:1},{holeNumber:13,par:4,handicap:1},{holeNumber:14,par:4,handicap:1},{holeNumber:15,par:4,handicap:1},{holeNumber:16,par:4,handicap:1},{holeNumber:17,par:4,handicap:1},{holeNumber:18,par:4,handicap:1}], website: 'http://www.bigcatsgolf.com/leopards-chase/', image: 'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/lc_logo.png', directions: 'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'},
      {name: 'Tigers Eye', id: 2, teesets:[{name: 'white', slope:123, courseRating:71.3}], website: 'http://www.bigcatsgolf.com/tigers-eye/', image:'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/te_logo.png', directions:'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'},
      {name: 'Panthers Run', id: 3, teesets:[{name: 'white',slope:123, courseRating:71.3}], website: 'http://www.bigcatsgolf.com/panthers-run/', image:'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/pr_logo.png', directions:'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'},
      {name: 'Lions Paw', id: 4, teesets:[{name:'white',slope:123, courseRating:71.3}], website: 'http://www.bigcatsgolf.com/lions-paw/', image:'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/lp_logo.png', directions:'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'}
    ];

  }

  function getById(courseId) {
    return  _.findWhere(list(),{id:+courseId});
    //return $filter('getById')(list(), courseId);
  }

}

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


/*
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
*/
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
