(function() {
  'use strict';

  angular
    .module('starter.core')
    .factory('scorecardService', scorecardService);

  scorecardService.$inject = ['$firebaseArray', 'firebaseDataService'];

  function scorecardService($firebaseArray, firebaseDataService) {

    var scorecards = null;

    return {
      Scorecard: Scorecard,
      reset: reset,
      list: list,
      getById: getById,
      add: add,
      getByTeetimeAndMemberIds: getByTeetimeAndMemberIds
    };

    ////////////

    function Scorecard() {
      this.name = '';
      this.phone = '';
    }

    function list() {
      return $firebaseArray(firebaseDataService.scorecards);
    }

    function getById(scorecardId) {
      var scorecard = _.findWhere(list(),{id:+scorecardId});
      return  scorecard;
      //return $filter('getById')(list(), courseId);
    }

    function add(teetime, member) {
      var course = teetime.course;
      var newScorecard = {teetimeId: teetime.id, courseId: teetime.courseId, memberId: member.id, scores:[]};
      _.each(course.holes,function(hole){
        newScorecard.scores.push({holeNumber: hole.holeNumber, handicap: hole.handicap, par: hole.par});
      });
      //_nextId++;
      //_scorecards.push(newScorecard);
      list().$add(newScorecard);
      return newScorecard;
    }

    function reset() {
      if (scorecards) {
        scorecards.$destroy();
        scorecards = null;
      }
    }

    function getByTeetimeAndMemberIds(teetimeId, memberId) {
      var scorecards = list();
      var scorecard = _.findWhere(scorecards,{teetimeId:+teetimeId, memberId: +memberId});
      return  scorecard;

    }
  }

})();
