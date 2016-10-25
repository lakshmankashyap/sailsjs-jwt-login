angular.module('myApp')
  .factory('Auth', function($http, LocalService, AccessLevels) {
    return {
      authorize: function(access) {
        if (access === AccessLevels.user) {
          return this.isAuthenticated();
        } else {
          return true;
        }
      },
      isAuthenticated: function() {
        return LocalService.get('auth_token');
      },
      login: function(credentials) {
        var login = $http.post('/auth/authenticate', JSON.stringify({email:credentials.email, password:credentials.password}));
        login.success(function(result) {
          LocalService.set('auth_token', JSON.stringify(result));
        });
        return login;
      },
      logout: function() {
        // The backend doesn't care about logouts, delete the token and you're good to go.
        LocalService.unset('auth_token');
      },
      register: function(formData) {
        LocalService.unset('auth_token');
        var register = $http.post('/auth/register', JSON.stringify({email:formData.email, password:formData.password, confirmPassword:formData.confirmPassword}));
        register.success(function(result) {
          LocalService.set('auth_token', JSON.stringify(result));
        });
        return register;
      },
      reset: function(email) {

        var reset = $http.post('/auth/reset', JSON.stringify({email:email.email}));
        reset.success(function(result) {
          console.log('successfully reset password');
        });
        return reset;

      }
    }
  })
  .factory('AuthInterceptor', function($q, $injector) {
    var LocalService = $injector.get('LocalService');

    return {
      request: function(config) {
        var token;
        if (LocalService.get('auth_token')) {
          token = angular.fromJson(LocalService.get('auth_token')).token;
        }
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          LocalService.unset('auth_token');
        }
        return $q.reject(response);
      }
    }
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });