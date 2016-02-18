(function (angular) {
  "use strict";

  var app = angular.module('golfplus.teetime', ['firebase.utils', 'firebase', 'golfplus.core']);

  app.factory('Teetimes', function (fbutil, $firebaseArray, firebaseDataService, $q) {

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
      var deferred = $q.defer();
/*
      var rec = list().$getRecord(teetimeId);
      if (rec) {
        console.log("Got post", rec);
        deferred.resolve(rec);
      } else {
        deferred.reject("Teetime with key:" + teetimeId + " not found.");
      }
*/
      list().$loaded().then(
        function(x){
          deferred.resolve(x.$getRecord(teetimeId));
        }); // record with $id
      return deferred.promise;
    }

    function findAllByCourseId(courseId) {
      return _.where(list(), {courseId: +courseId})
    }

    function add(teetime) {
      list().$add(teetime);
    }
  });


  app.controller('TeetimesCtrl', function ($scope, teetimes, Courses) {
    $scope.teetimes = teetimes;
    _.each($scope.teetimes, function (teetime) {
      teetime.course = Courses.getById(teetime.courseId);
    });
  });

  app.controller('TeetimeCtrl', function ($scope, $stateParams, $ionicModal, teetime, Courses, Pairings, Members, Scorecards, Teetimes) {
    $scope.teetime = teetime;
    $scope.allCourses = Courses.list();
    $scope.allTeetimes = Teetimes.list();
    $scope.course = _.findWhere($scope.allCourses,{$id: $scope.teetime.courseId});
    //$scope.teetime.pairings = Pairings.findAllByTeetimeId($scope.teetime.$id);
    $scope.members = Members.list();

    $ionicModal.fromTemplateUrl('js/teetime/pairing-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.pairingModal = modal;
    });
    $scope.openModal = function () {
      $scope.pairingModal.show();
    };
    $scope.closeModalSave = function () {
      //TODO get all selected members and create pairing, add it to the teetime
      var selectedCourse = _.findWhere($scope.allCourses,{$id: $scope.teetime.courseId});
      var teeset = selectedCourse.teesets[0]; //TODO select one?
      var pairing = {name: '', players: []};
      $scope.teetime.pairings.push(pairing);
      _.each($scope.members, function (member) {
        if (member.selected) {
          //create a scorecard for all the holes on the course
          Scorecards.add(selectedCourse, teeset, member).then(function(ref){
            pairing.players.push({
              memberId: member.id,
              name: member.firstName,
              courseIndex: 14,
              totalScore: 0,
              scorecardId: ref.key()
            });

          });
        }
      });

      $scope.allTeetimes.$add($scope.teetime);
      $scope.pairingModal.hide();
    };
    $scope.closeModalNoSave = function () {
      $scope.pairingModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.pairingModal.remove();
    });
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
            return Teetimes.list();
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
            return Teetimes.getById($stateParams.teetimeId);
          }
        }
      })
      .state('app.newteetime', {
        url: '/teetime/create',
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
