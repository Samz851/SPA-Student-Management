angular.module('authTokenFactory',[])
.factory('AuthToken', function($window){
    var authTokenFactory = {};
    authTokenFactory.setToken = function(token) {
        if(token) {
        $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token', token);
        }
    };

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})
.factory('authInterceptors', function(AuthToken){
    var authInterceptorsFactory = {};
    authInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken();
        if(token) config.headers['x-access-token'] = token;
        return config;
    }

    return authInterceptorsFactory;
})