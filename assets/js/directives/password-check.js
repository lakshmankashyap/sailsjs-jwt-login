'use strict';

angular.module('myApp.password-check', [])

.directive('passwordCheck', [function() {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var pass1 = angular.element(document.getElementById(attrs.passwordCheck));
        scope.clickingCallback = function() {
            scope.$apply(function () {
                var v = elem.val()===pass1.val();
                ctrl.$setValidity('pwmatch', v);
            });
        };

        elem.bind('keyup', scope.clickingCallback);
        pass1.bind('keyup', scope.clickingCallback);
      }
    }
}]);
