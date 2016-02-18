(function (angular) {
  "use strict";

  var app = angular.module('golfplus.scorecard', ['firebase.utils', 'firebase', 'golfplus.core', 'golfplus.course', 'golfplus.teetime']);

  app.factory('Scorecards', function (fbutil, $firebaseArray, firebaseDataService, $firebaseObject) {

    var service = {
      list: list,
      getById: getById,
      Scorecard: Scorecard,
      add: add
    };

    return service;

    function Scorecard() {
      this.courseId = '';
      this.teeset = '';
      this.playDate = new Date().toISOString();
      this.time = '9 am';
      this.totalScore = 0;
      this.new = true;
      this.scores = [];
    }

    function list() {
      return $firebaseArray(firebaseDataService.scorecards);

    }

    function getById(scorecardId) {
      return $firebaseObject(firebaseDataService.scorecards.child(scorecardId));
    }

    function add(course, teeset, member) {
      var newScorecard = new Scorecard();
      newScorecard.memberId = member.id;
      newScorecard.courseId = course.$id;
      newScorecard.teeset = teeset.name;
      _.each(teeset.holes, function (hole) {
        newScorecard.scores.push({holeNumber: hole.number, handicap: hole.handicap, par: hole.par, score: 0});
      });
      return list().$add(newScorecard);
      //return newScorecard;
    }


  });

  app.controller('ScorecardCtrl', function ($scope, $stateParams, Scorecards, Courses, Members, scorecard) {
    console.log($stateParams);
    //expect a scorecardId which should get you courseId, member, etc
    //var scorecard = Scorecards.getById($stateParams.scorecardId).then();
    $scope.allScorecards = Scorecards.list();
    $scope.scorecard = scorecard;
    $scope.course = Courses.getById($scope.scorecard.courseId);
    $scope.player = Members.getById($scope.scorecard.memberId);

    $scope.update = function(score) {
      //$scope.scorecard.totalScore = $scope.scorecard.scores.score;
      var total = 0;
      _.each($scope.scorecard.scores,function(score){
        total += score.score;
      });
      $scope.scorecard.totalScore = total;

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
