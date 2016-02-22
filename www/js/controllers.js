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

    $scope.save = function() {
      Members.list().$save($scope.member);
    };
  })


;
