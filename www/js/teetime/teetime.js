(function (angular) {
  "use strict";

  var app = angular.module('golfplus.teetime', ['firebase', 'golfplus.core']);

  app.factory('Teetimes', function ($firebaseArray, firebaseDataService, $firebaseObject) {

    var service = {
      list: list,
      getById: getById,
      findAllByCourseId: findAllByCourseId,
      Teetime: Teetime,
      add: add
    };

    return service;

    function Teetime() {
      this.courseId = '';
      this.teeset = '';
      this.playDate = new Date().toISOString();
      this.time = '9 am';
      this.pairings = [];
      this.new = true;
    }

    function list() {
      /*
       return [
       {id: 1, courseId: 1, date: new Date().toISOString(), time: '9am'},
       {id: 2, courseId: 2, date: new Date().toISOString(), time: '9am'},
       {id: 3, courseId: 3, date: new Date().toISOString(), time: '9am'},
       {id: 4, courseId: 4, date: new Date().toISOString(), time: '9am'}
       ];
       */
      return $firebaseArray(firebaseDataService.teetimes);

    }

    function getById(teetimeId) {
      var ref = firebaseDataService.teetimes.child(teetimeId);
      return $firebaseObject(ref);
    }

    function findAllByCourseId(courseId) {
      return _.where(list(), {courseId: +courseId})
    }

    function add(teetime) {
      list().$add(teetime);
    }
  });


  app.controller('TeetimesCtrl', function ($scope, teetimes, courses) {
    $scope.teetimes = teetimes;
    _.each($scope.teetimes, function (teetime) {
      teetime.course = _.findWhere(courses,{$id: teetime.courseId});
    });
  });

  app.controller('TeetimeCtrl', function ($scope, $stateParams, $ionicModal, teetime, Courses, Pairings, Members, Scorecards, Teetimes, $q, $state) {
    $scope.teetime = teetime;
    $scope.scorecards = Scorecards.findAllByByTeetimeId(teetime.$id);
    $scope.allCourses = Courses.list();
    $scope.allTeetimes = Teetimes.list();
    $scope.course = _.findWhere($scope.allCourses,{$id: $scope.teetime.courseId});
    $scope.selectedCourseId = null;
    $scope.selectedTeeset = null;

    //$scope.teetime.pairings = Pairings.findAllByTeetimeId($scope.teetime.$id);

    $scope.members = Members.list();

    function loadPlayerScorecardsForTeetime(teetime) {
      var retVal =  Scorecards.findAllByByTeetimeId(teetime.teetimeId);
      return retVal;
/*
      _.each(teetime.pairings,function(pairing) { //populate player scorecards for the page
        _.each(pairing.players,function(player){
          player.scorecard = Scorecards.getById(player.scorecardId);
        });
      });
*/
    }

    $ionicModal.fromTemplateUrl('js/teetime/pairing-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.pairingModal = modal;
    });
    $scope.openModal = function () {
      $scope.pairingModal.show();
    };

    function createPairingForSelectedMembers(selectedCourse, teeset, teetime) {
      var deferred = $q.defer();

      var pairing = {players: []};
      var scorecardPromises = [];
      _.each($scope.members, function (member) {
        if (member.selected) {
          //create a scorecard for all the holes on the course
          scorecardPromises.push(Scorecards.add(selectedCourse, teeset, member, teetime).then(function(scorecard){
            pairing.players.push({
              scorecardId: scorecard.key()
            });

          }));
          member.selected = false;
        }
      });
      $q.all(scorecardPromises).then(function(){
        deferred.resolve(pairing);
      });
      return deferred.promise;
    }

    $scope.closeModalSave = function () {
      //TODO get all selected members and create pairing, add it to the teetime
      var selectedCourse = _.findWhere($scope.allCourses,{$id: $scope.teetime.courseId});
      var teeset = selectedCourse.teesets[0]; //TODO select one?

        if (!$scope.teetime.$id) { //redirect unsaved teetimes to teetime edit page
          $scope.allTeetimes.$add($scope.teetime).then(function(addedTeetime){
            console.log('added teetime id '+addedTeetime.key());
            createPairingForSelectedMembers(selectedCourse, teeset, addedTeetime).then(function(pairing){
              $scope.teetime.pairings.push(pairing);
              $state.go('app.teetime',{teetimeId:addedTeetime.key()});
            });
          });
        } else {
          $scope.allTeetimes.$save($scope.teetime).then(function(updatedTeetime){
            createPairingForSelectedMembers(selectedCourse, teeset, $scope.teetime).then(function(pairing){
              $scope.teetime.pairings.push(pairing);
              loadPlayerScorecardsForTeetime($scope.teetime);
              $scope.pairingModal.hide();
            });
          });
        }
    };

    $scope.closeModalNoSave = function() {
      $scope.pairingModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.pairingModal.remove();
    });

    $scope.loadTeesets = function() {
      var selectedCourse = _.findWhere($scope.allCourses,{$id: $scope.teetime.courseId});
      $scope.teesets = selectedCourse.teesets;
    };
  });

  app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('app.teetimes', {
        url: '/teetimes',
        views: {
          'menuContent': {
            templateUrl: 'js/teetime/teetimes.html',
            controller: 'TeetimesCtrl'
          }
        },
        cache: false,
        resolve: {
          teetimes: function (Teetimes, $stateParams) {
            console.debug($stateParams);
            return Teetimes.list().$loaded();
          },
          courses: function(Courses) {
            return Courses.list().$loaded();
          }
        }
      })
      .state('app.teetime', {
        url: '/teetimes/:teetimeId',
        views: {
          'menuContent': {
            templateUrl: 'js/teetime/teetime.html',
            controller: 'TeetimeCtrl'
          }
        },
        cache: false,
        resolve: {
          teetime: function (Teetimes, $stateParams) {
            console.debug($stateParams);
            var temp = Teetimes.getById($stateParams.teetimeId);
            return temp;
          }
        }
      })
      .state('app.newteetime', {
        url: '/teetimes/create',
        views: {
          'menuContent': {
            templateUrl: 'js/teetime/newteetime.html',
            controller: 'TeetimeCtrl'
          }
        },
        cache: false,
        resolve: {
          teetime: function (Teetimes) {
            var temp = new Teetimes.Teetime();
            return temp;
          }
        }
      })
    ;

  }]);


})(angular);
