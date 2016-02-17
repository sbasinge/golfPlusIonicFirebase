(function() {
  'use strict';

  angular
    .module('starter.core')
    .factory('scorecardService', scorecardService);

  scorecardService.$inject = ['$firebaseArray', 'firebaseDataService', '$firebaseObject'];

  function scorecardService($firebaseArray, firebaseDataService, $firebaseObject) {

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
      var list = $firebaseArray(firebaseDataService.scorecards);
      list.$loaded().then(function(loadedList){return loadedList;});
    }

    function getById(scorecardId) {
      //var scorecard = _.findWhere(list(),{id:+scorecardId});
      return list().$getRecord(scorecardId);
/*
      list().$loaded().then(function(loadedList){
        return loadedList.$getRecord(scorecardId);
      });
*/
      //return  scorecard;
      //return $filter('getById')(list(), courseId);
    }

    function add(teetime, member) {
      var course = teetime.course;
/*
      var newRef = scorecards.child(teetime.id+'-'+member.id);
      var newScorecard = $firebaseObject(newref);
      newScorecard.$id(teetime.id+'-'+member.id);
      newScorecard.$value = {teetimeId: teetime.id, courseId: teetime.courseId, memberId: member.id, scores:[]};
*/
      var newScorecard = {teetimeId: teetime.id, courseId: teetime.courseId, memberId: member.id, scores:[]};
      _.each(course.holes,function(hole){
        newScorecard.scores.push({holeNumber: hole.holeNumber, handicap: hole.handicap, par: hole.par});
      });
      //_nextId++;
      //_scorecards.push(newScorecard);
      //list().$add(newScorecard);
/*
      list().$add(newScorecard).then(function(ref) {
        var id = ref.key();
        newScorecard.id = id;
        console.log("added scorecard with id " + id);
        list().$indexFor(id); // returns location in the array
      });
*/
      return newScorecard;
    }

    function reset() {
      if (scorecards) {
        scorecards.$destroy();
        scorecards = null;
      }
    }

    function getByTeetimeAndMemberIds(teetimeId, memberId) {

      var ref = firebaseDataService.scorecards;
      ref.orderByChild("teetimeId").equalTo(teetimeId).on("child_added", function(snapshot) {
        console.log('Found key: '+snapshot.key());
      });

      var scorecards = list();
      var scorecard = _.findWhere(scorecards,{teetimeId:+teetimeId, memberId: +memberId});
      return  scorecard;

    }
  }

})();
