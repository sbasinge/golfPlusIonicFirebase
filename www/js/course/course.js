(function (angular) {
  "use strict";

  var app = angular.module('golfplus.course', ['firebase.utils', 'firebase', 'golfplus.core']);

  app.controller('CoursesCtrl', ['$scope', 'Courses', 'Teetimes', function ($scope, Courses, Teetimes) {
    $scope.courses = Courses.list();
    //$scope.courses = $firebaseArray(firebaseDataService.courses);
    _.each($scope.courses, function (course) {
      course.teetime = Teetimes.findAllByCourseId(course.courseId);
    });

  }]);

  app.controller('CourseCtrl', function ($scope, $stateParams, Pairings, course, $firebaseArray, firebaseDataService) {
    $scope.course = course;
    $scope.courses = $firebaseArray(firebaseDataService.courses);

    $scope.save = function() {
      console.log('Saving '+JSON.stringify(course));
      $scope.courses.$add(course);
      //if it's new then make a firebarse ref out of it
      //call $save
    };
  });

  app.factory('Courses', ['fbutil', '$firebaseArray', 'firebaseDataService', function (fbutil, $firebaseArray, firebaseDataService) {
    //var ref = fbutil.ref('courses').limitToLast(10);
    //return $firebaseArray(ref);

    var service = {
      list: list,
      getById: getById,
      Course: Course,
      Teeset: Teeset,
      Hole: Hole
    };

    return service;


    function Course() {
      this.name = '';
      this.phone = '';
      this.address = '';
      this.website = '';
      this.image = '';

      this.teesets = [new Teeset('white', 123, 70.2)];
      this.holes = [new Hole(1, 4, 3, 375)];
      this.new = true;
    }

    function Teeset(name, slope, rating) {
      // Public properties, assigned to the instance ('this')
      this.name = name;
      this.slope = slope;
      this.rating = rating;
    }

    function Hole(number, par, handicap, yards) {
      this.number = number;
      this.par = par;
      this.handicap = handicap;
      this.yards = yards;
    }

    function list() {
      /*
       return [
       {name: 'Leopards Chase', id: 1, teesets:[{name: 'white', slope:123, courseRating:71.3}], holes:[{holeNumber:1,par:4,handicap:1},{holeNumber:2,par:4,handicap:1},{holeNumber:3,par:4,handicap:1},{holeNumber:4,par:4,handicap:1},{holeNumber:5,par:4,handicap:1},{holeNumber:6,par:4,handicap:1},{holeNumber:7,par:4,handicap:1},{holeNumber:8,par:4,handicap:1},{holeNumber:9,par:4,handicap:1},{holeNumber:10,par:4,handicap:1},{holeNumber:11,par:4,handicap:1},{holeNumber:12,par:4,handicap:1},{holeNumber:13,par:4,handicap:1},{holeNumber:14,par:4,handicap:1},{holeNumber:15,par:4,handicap:1},{holeNumber:16,par:4,handicap:1},{holeNumber:17,par:4,handicap:1},{holeNumber:18,par:4,handicap:1}], website: 'http://www.bigcatsgolf.com/leopards-chase/', image: 'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/lc_logo.png', directions: 'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'},
       {name: 'Tigers Eye', id: 2, teesets:[{name: 'white', slope:123, courseRating:71.3}], website: 'http://www.bigcatsgolf.com/tigers-eye/', image:'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/te_logo.png', directions:'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'},
       {name: 'Panthers Run', id: 3, teesets:[{name: 'white',slope:123, courseRating:71.3}], website: 'http://www.bigcatsgolf.com/panthers-run/', image:'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/pr_logo.png', directions:'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'},
       {name: 'Lions Paw', id: 4, teesets:[{name:'white',slope:123, courseRating:71.3}], website: 'http://www.bigcatsgolf.com/lions-paw/', image:'http://www.bigcatsgolf.com/wp-content/uploads/2013/02/lp_logo.png', directions:'https://www.google.com/maps?q=351+Ocean+Ridge+Parkway+Southwest,+Ocean+Isle+Beach,+NC&hl=en&sll=35.170517,-79.860994&sspn=5.566692,11.195068&oq=351+Ocean+Ridge+Pkwy&t=h&hnear=351+Ocean+Ridge+Pkwy+SW,+Ocean+Isle+Beach,+Brunswick,+North+Carolina+28469&z=16'}
       ];
       */
      return $firebaseArray(firebaseDataService.courses);
      //list.$loaded().then(function(loadedList){return loadedList;});
    }

    function getById(courseId) {
      return _.findWhere(list(), {id: +courseId});
      //return $filter('getById')(list(), courseId);
    }

  }]);

  app.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.courses', {
        url: '/courses',
        views: {
          'menuContent': {
            templateUrl: 'js/course/courses.html',
            controller: 'CoursesCtrl'
          }
        }
      })
      .state('app.course', {
        url: '/courses/:courseId',
        views: {
          'menuContent': {
            templateUrl: 'js/course/course.html',
            controller: 'CourseCtrl'
          }
        }
      })
      .state('app.newcourse', {
        url: '/courses/create',
        views: {
          'menuContent': {
            templateUrl: 'js/course/newcourse.html',
            controller: 'CourseCtrl'
          }
        },
        resolve: {
          course: ['Courses', function (Courses) {
            var temp = new Courses.Course();
            return temp;
          }]
        }
      });

  }]);
})(angular);
