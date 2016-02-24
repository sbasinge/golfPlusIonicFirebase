(function (angular) {
  "use strict";

  var app = angular.module('golfplus.scorecard', ['firebase', 'golfplus.core', 'golfplus.course', 'golfplus.teetime']);

  app.factory('Scorecards', function ($firebaseArray, firebaseDataService, $firebaseObject) {

    var service = {
      list: list,
      getById: getById,
      Scorecard: Scorecard,
      add: add,
      findAllByByTeetimeId: findAllByByTeetimeId
    };

    return service;

    function Scorecard() {
      this.courseId = '';
      this.teeset = '';
      this.playDate = new Date().toISOString();
      this.time = '9 am';
      this.totalScore = 0;
      this.thru = 0;
      this.scores = [];
    }

    function list() {
      return $firebaseArray(firebaseDataService.scorecards);

    }

    function getById(scorecardId) {
      return $firebaseObject(firebaseDataService.scorecards.child(scorecardId));
    }

    function findAllByByTeetimeId(teetimeId) {
      return $firebaseArray(firebaseDataService.scorecards.orderByChild('teetimeId').startAt(teetimeId).endAt(teetimeId));
    }

    function add(course, teeset, member, teetime) {
      var newScorecard = new Scorecard();
      newScorecard.memberId = member.id;
      newScorecard.courseId = course.$id;
      newScorecard.teeset = teeset.name;
      newScorecard.courseIndex = Math.round(((member.handicap * teeset.slope)/113));
      newScorecard.totalScore = 0;
      newScorecard.totalNet = 0;
      newScorecard.name = member.firstName;
      newScorecard.teetimeId = teetime.key();

        _.each(teeset.holes, function (hole) {
        newScorecard.scores.push({holeNumber: hole.number, handicap: hole.handicap, par: hole.par, score: null, net: 0});
      });
      return list().$add(newScorecard);
      //return newScorecard;
    }


  });

  app.controller('ScorecardCtrl', function ($scope, $stateParams, Scorecards, Courses, Members, scorecard) {
    console.log($stateParams);
    //expect a scorecardId which should get you courseId, member, etc
    //var scorecard = Scorecards.getById($stateParams.scorecardId).then();
    //$scope.allScorecards = Scorecards.list();
    $scope.scorecard = scorecard;
    $scope.course = Courses.getById($scope.scorecard.courseId);
    $scope.player = Members.getById($scope.scorecard.memberId);
    //get the pairings to build leaderboard
    $scope.showLeaderboard = false;
    $scope.scorecards = Scorecards.findAllByByTeetimeId(scorecard.teetimeId);

    $scope.toggleLeaderboard = function() {
      $scope.showLeaderboard = !$scope.showLeaderboard;
    };
    $scope.isLeaderboardShown = function() {
      return $scope.showLeaderboard;
    };

    $scope.update = function(score) {
      var total = 0;
      var totalNet = 0;
      var overUnder = 0;
      var overUnderNet = 0;
      var thru = 0;
      _.each($scope.scorecard.scores,function(score){
        if (score.score > 0) {
          total += score.score;
          //if courseIndex is 10 then handicap holes 1 thru 10 get 1 stroke
          //if course index is 23 then handicap holes 1 thru 5 get 2 strokes and 6 thru 18 get 1
          //courseIndex/18 +
          var adjustment = 0;
          var courseIndex = $scope.scorecard.courseIndex;
          if (courseIndex >= 18) {
            adjustment = 1;
            courseIndex -= 18;
          }
          if (courseIndex < score.handicap) {
            score.net = score.score - adjustment;
          } else {
            score.net = score.score - 1 - adjustment;
          }
          totalNet += score.net;
          overUnderNet += (score.net - score.par);
          overUnder += (score.score - score.par);
          thru++;
        }
      });
      $scope.scorecard.totalScore = total;
      $scope.scorecard.totalNet = totalNet;
      $scope.scorecard.overUnder = overUnder;
      $scope.scorecard.overUnderNet = overUnderNet;
      $scope.scorecard.thru = thru;
      $scope.scorecard.$save();
    };
  });


  app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
    .state('app.scorecard', {
      url: '/scorecard/:scorecardId',
      views: {
        'menuContent': {
          templateUrl: 'js/scorecard/scorecard.html',
          controller: 'ScorecardCtrl'
        }
      },
      cache: false,
      resolve: {
        scorecard: function (Scorecards, $stateParams) {
          console.debug($stateParams);
          return Scorecards.getById($stateParams.scorecardId);
          //return $firebaseArray(firebaseDataService.scorecards).$getRecord($stateParams.scorecardId);
        }
      }
    });

  }]);

})(angular);
