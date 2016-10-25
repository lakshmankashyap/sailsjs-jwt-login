'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.router',
  'myApp.landing',
  'myApp.menu-toggle',
  'myApp.nav',
  'myApp.version',
  'myApp.config',
  'myApp.password-check'

])
.config(['$routeProvider', 'AccessLevels',
    function($routeProvider, AccessLevels) {
        $routeProvider.
        when('/home', {
            templateUrl: 'views/home.html',
            data: {
                access: AccessLevels.user
            }
        }).
        when('/help', {
            templateUrl: 'views/help.html',
            data: {
                access: AccessLevels.anon
            }
        }).
        when('/', {
            templateUrl: 'views/landing-page.html',
            data: {
                access: AccessLevels.anon
            }
        }).
        otherwise({
            redirectTo: '/'
        });
    }
])

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/'});
}])

.run(['$rootScope', '$state', '$window', 'Auth', 'LocalService', function($rootScope, $state, $window, Auth, LocalService) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (next.data && !Auth.authorize(next.data.access)) {
      event.preventDefault();
      LocalService.unset('auth_token');
      $window.location.href = "#!/";
    }
  })
}]);