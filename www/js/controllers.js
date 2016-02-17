angular.module('golfplus.controllers', [])

  .controller('AppCtrl', function ($rootScope, $scope, $ionicModal, Auth) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      Auth.$authWithOAuthRedirect("facebook").then(function (authData) {
        // User successfully logged in
        console.log('User successfully logged in');
      }).catch(function (error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          Auth.$authWithOAuthPopup("facebook").then(function (authData) {
            // User successfully logged in. We can log to the console
            // since we’re using a popup here
            console.log(authData);
            $scope.modal.hide();
          });
        } else {
          // Another error occurred
          console.log(error);
        }
      });
    };

    Auth.$onAuth(function (authData) {
      if (authData === null) {
        console.log("Not logged in yet");
      } else {
        console.log("Logged in as", authData.uid);
      }
      //$scope.authData = authData; // This will display the user's name in our view
      $rootScope.authData = authData;

      var user = Ionic.User.current();

// if the user doesn't have an id, you'll need to give it one.
      if (!user.id) {
        console.log('Setting user id and name');
        user.id = authData.uid;
        // user.id = 'your-custom-user-id';
      }

//persist the user
      user.set('name', authData.facebook.displayName);
      user.save();
    });

  })

  .controller('MembersCtrl', function ($scope, Members) {
    $scope.members = Members.list();
  })
  .controller('MemberCtrl', function ($scope, $stateParams, Members) {
    $scope.member = Members.getById($stateParams.memberId);
  })
  .controller('TeetimesCtrl', function ($scope, Teetimes, Courses) {
    $scope.teetimes = Teetimes.list();
    _.each($scope.teetimes,function(teetime){
      teetime.course = Courses.getById(teetime.courseId);
    });
  })
  .controller('TeetimeCtrl', function ($scope, $stateParams, $ionicModal, Teetimes, Courses, Pairings, Members, Scorecards) {
    $scope.teetime = Teetimes.getById($stateParams.teetimeId);
    $scope.teetime.course = Courses.getById($scope.teetime.courseId);
    $scope.teetime.pairings = Pairings.findAllByTeetimeId($scope.teetime.id);
    $scope.members = Members.list();
    $scope.pairing = {name:'', players:[]};

    $ionicModal.fromTemplateUrl('templates/pairing-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModalSave = function() {
      //TODO get all selected members and create pairing, add it to the teetime

      var list = Scorecards.list();
      _.each($scope.members,function(member){
        if (member.selected) {
          //create a scorecard for all the holes on the course
          var scorecard = Scorecards.add($scope.teetime, member);
          list.$add(scorecard).then(function(ref) {
            var id = ref.key();
            scorecard.id = id;
            console.log("added scorecard with id " + id);
            list.$indexFor(id); // returns location in the array
            $scope.pairing.players.push({memberId: member.id, name: member.firstName, courseIndex: 14, totalScore: 0, scorecardId: scorecard.id});
          });
        }
      });
      Pairings.add($scope.pairing);
      $scope.teetime.pairings.push($scope.pairing);
      $scope.pairing = {name:'', players:[]};
      $scope.modal.hide();
    };
    $scope.closeModalNoSave = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  })

  .controller('ScorecardCtrl', function ($scope, $stateParams, scorecardService, Courses, Members) {
    console.log($stateParams);
    //expect a scorecardId which should get you courseId, member, etc
    var scorecard = scorecardService.getById($stateParams.scorecardId).then();
    var course = Courses.getById(scorecard.courseId);
    var player = Members.getById(scorecard.memberId);
    scorecard.course = course;
    scorecard.member = player;
    $scope.scorecard = scorecard;
    $scope.course = course;

  })

;
