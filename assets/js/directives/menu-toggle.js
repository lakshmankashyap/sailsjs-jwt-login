'use strict';

angular.module('myApp.menu-toggle', [])

.directive('menuToggle', function(version) {
  return function(scope, elm, attrs) {
      scope.clickingCallback = function() {
          var menu = angular.element(document.querySelector('.nav-menu'));
          elm.toggleClass('is-active');
          menu.toggleClass('is-active');
        };
      elm.bind('click', scope.clickingCallback);  
  };
});
