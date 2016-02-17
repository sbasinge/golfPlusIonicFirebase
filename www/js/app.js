'use strict';

// Declare app level module which depends on filters, and services
angular.module('golfplus', [
    'ionic',
    'ionic.service.core',
    'ionic.service.analytics',
    'firebase',
    'golfplus.config',
    'firebase.auth',
    'golfplus.course',
    //'golfplus.security',
    //'golfplus.home',
    //'golfplus.account',
    //'golfplus.chat',
    //'golfplus.login'
    'golfplus.controllers',
    'golfplus.services',
    'golfplus.filters'
  ])
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

  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl as main'
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
      .state('app.scorecard', {
        url: '/scorecard/:scorecardId',
        views: {
          'menuContent': {
            templateUrl: 'templates/scorecard.html',
            controller: 'ScorecardCtrl'
          }
        }
      })
    ;

    $urlRouterProvider.otherwise('/app/courses');
  }])

  .run(['$rootScope', 'Auth', function ($rootScope, Auth) {
    // track status of authentication
    Auth.$onAuth(function (user) {
      $rootScope.loggedIn = !!user;
    });
  }]);
