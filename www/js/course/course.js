(function (angular) {
  "use strict";

  var app = angular.module('golfplus.course', ['firebase', 'golfplus.core','golfplus.teetime']);

  app.controller('CoursesCtrl', ['$scope', 'Courses', 'Teetimes', function ($scope, Courses, Teetimes) {
    $scope.courses = Courses.list();
    //$scope.courses = $firebaseArray(firebaseDataService.courses);
    _.each($scope.courses, function (course) {
      course.teetime = Teetimes.findAllByCourseId(course.courseId);
    });

  }]);

  app.controller('CourseCtrl', function ($scope, course, firebaseDataService, $state) {
    //console.info('Entering CourseCtrl with course '+JSON.stringify(course));
    $scope.course = course;

    $scope.toggleHoles = function(teeset) {
      teeset.show = !teeset.show;
    };
    $scope.areHolesShown = function(teeset) {
      return teeset.show;
    };

    $scope.save = function(thisCourse) {
      var courseRef = firebaseDataService.courses.child(thisCourse.name);
      courseRef.once("value", function(snapshot) {
        if (!snapshot.exists()) {
          courseRef.set(thisCourse);
          $state.go('app.course',{courseId:thisCourse.name});
        } else {
          console.warn('This course already exits');
          //thisCourse.teesets[0].rating += 1;
          //thisCourse.teesets[0].holes[0].yards=320;
          thisCourse.$save();
        }
      });
    };

  });

  app.factory('Courses', function ($firebaseArray, firebaseDataService, $firebaseObject) {

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
      this.new = true;
    }

    function Teeset(name, slope, rating) {
      this.name = name;
      this.slope = slope;
      this.rating = rating;
      this.holes = [new Hole(1, 4, 3, 375),new Hole(2, 4, 3, 375),new Hole(3, 4, 3, 375),new Hole(4, 4, 3, 375),new Hole(5, 4, 3, 375),new Hole(6, 4, 3, 375),new Hole(7, 4, 3, 375),new Hole(8, 4, 3, 375),new Hole(9, 4, 3, 375),
        new Hole(10, 4, 3, 375),new Hole(11, 4, 3, 375),new Hole(12, 4, 3, 375),new Hole(13, 4, 3, 375),new Hole(14, 4, 3, 375),new Hole(15, 4, 3, 375),new Hole(16, 4, 3, 375),new Hole(17, 4, 3, 375),new Hole(18, 4, 3, 375)];
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
    }

    function getById(courseId) {
      var ref = firebaseDataService.courses.child(courseId);
      return $firebaseObject(ref);
    }

  });

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
        },
        cache: false,
        resolve: {
          course: function (Courses, $stateParams) {
            console.debug($stateParams);
            var temp = Courses.getById($stateParams.courseId);
            return temp;
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
        cache: false,
        resolve: {
          course: function (Courses) {
            var temp = new Courses.Course();
            return temp;
          }
        }
      });

  }]);
})(angular);
