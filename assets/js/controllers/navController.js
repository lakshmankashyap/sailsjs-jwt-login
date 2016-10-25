'use strict';

angular.module('myApp.nav', ['ngRoute', 'myApp.config'])

.controller('NavController', ['$scope', '$state', '$window','Auth', 'CurrentUser', function($scope, $state, $window, Auth, CurrentUser) {

    $scope.showLogin = true;
    $scope.showForgot = false;
    $scope.auth = Auth;
    $scope.user = CurrentUser.user;
    $scope.errors = [];
    $scope.loginInProgress = false;
    $scope.registerInProgress = false;
    $scope.resetInProgress = false;

    $scope.togglePopup = function() {
        var loginPopup = angular.element(document.getElementsByClassName('modal'));
        loginPopup.toggleClass('is-active');
    };

    $scope.openLogin = function() {
        $scope.showForgot = false;
        $scope.showLogin = true;
        $scope.togglePopup();
    };

    $scope.openSignup = function() {
        $scope.showForgot = false;
        $scope.showLogin = false;
        $scope.togglePopup();
    };

    $scope.openForgot = function() {
        $scope.showLogin = false;
        $scope.showForgot = true;
        $scope.togglePopup();
    };

    $scope.logout = function() {
      Auth.logout();
      $window.location.href = "#!/";
    };

    $scope.register = function(isValid) {
        if(!isValid) {
            return;
        }
        
        $scope.errors = [];
        $scope.registerInProgress = true;

        Auth.register($scope.user).success(function() {
            $scope.togglePopup();
            $window.location.href = "#!/home/";
        }).error(function(err) {
            $scope.errors.push(err);
            $scope.registerInProgress = false;
        })
    };

    $scope.login = function() {
      $scope.errors = [];
      $scope.loginInProgress = true;

      Auth.login($scope.user).success(function(result) {
        $scope.togglePopup();
        $window.location.href = "#!/home/";
      }).error(function(err) {
        $scope.errors.push(err);
        $scope.loginInProgress = false;
      })
    };

    $scope.reset = function() {
        $scope.errors = [];
        $scope.resetInProgress = true;

        Auth.reset($scope.user).success(function(result) {
            $scope.resetInProgress = false;
        }).error(function(err) {
            $scope.errors.push(err);
            $scope.resetInProgress = false;
      })
    };

}]);