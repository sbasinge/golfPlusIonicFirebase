// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'firebase', 'starter.controllers', 'starter.services', 'starter.filters', 'starter.core'])

.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {
    $ionicAnalytics.register();

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    var settings = new Ionic.IO.Settings();
    console.log(JSON.stringify(settings));

    // kick off the platform web client
    Ionic.io();

  });
})
  .factory("Items", function($firebaseArray) {
    var itemsRef = new Firebase("https://boiling-torch-3772.firebaseio.com/items");
    return $firebaseArray(itemsRef);
  })
  .factory("Auth", function($firebaseAuth) {
    var usersRef = new Firebase("https//boiling-torch-3772.firebaseio.com/users");
    return $firebaseAuth(usersRef);
  })
  .controller("ListCtrl", function($scope, Items, Auth) {
    $scope.items = Items;

    $scope.addItem = function() {
      var name = prompt("What do you need to buy?");
      if (name) {
        $scope.items.$add({
          "name": name
        });
      }
    };

  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl as main'
      })

      .state('app.courses', {
        url: '/courses',
        views: {
          'menuContent': {
            templateUrl: 'templates/courses.html',
            controller: 'CoursesCtrl'
          }
        }
      })
      .state('app.members', {
        url: '/members',
        views: {
          'menuContent': {
            templateUrl: 'templates/members.html',
            controller: 'MembersCtrl'
          }
        }
      })
      .state('app.member', {
        url: '/member/:memberId',
        views: {
          'menuContent': {
            templateUrl: 'templates/member.html',
            controller: 'MemberCtrl'
          }
        }
      })
      .state('app.teetimes', {
        url: '/teetimes',
        views: {
          'menuContent': {
            templateUrl: 'templates/teetimes.html',
            controller: 'TeetimesCtrl'
          }
        }
      })
      .state('app.teetime', {
        url: '/teetimes/:teetimeId',
        views: {
          'menuContent': {
            templateUrl: 'templates/teetime.html',
            controller: 'TeetimeCtrl'
          }
        }
      })
      .state('app.course', {
        url: '/courses/:courseId',
        views: {
          'menuContent': {
            templateUrl: 'templates/course.html',
            controller: 'CourseCtrl'
          }
        }
      })
      .state('app.scorecard', {
        url: '/scorecard/:teetimeId/:memberId',
        views: {
          'menuContent': {
            templateUrl: 'templates/scorecard.html',
            controller: 'ScorecardCtrl'
          }
        }
      })
;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/courses');
  })

;
