angular.module('authService',['authTokenFactory'])
.factory('Auth', function($window, $http, $q, $rootScope, $state, AuthToken, $timeout){
    // UI-Router related variables
    
    authFactory={};
    identityAuthenticated = false;
    authFactory.identity = {
        role: 'guest'
    }

    authFactory.login = function(loginData){
        return $http.post('/api/authenticate', loginData)
        .then(function(data) {
            AuthToken.setToken(data.data.token);
            identityAuthenticated = true;
            // getUser
            return data;
        });
    };

    authFactory.isLoggedIn = function() {
        if(AuthToken.getToken()) {
            identityAuthenticated = true;
            return true;
        } else {
            return false;
        }
    };

    authFactory.facebook = function(token){
        AuthToken.setToken(token);
    }

    authFactory.getUser = function(){
        var deferred = $q.defer();
        authFactory.decodeToken().then(function(data){
            if(data){
                deferred.resolve(data);
                identityAuthenticated = true;
                if(!data.data.success){ // has token
                    authFactory.identity.username = 'Guest1'
                    authFactory.identity.role = 'guest'; 
                }else{ // does not have token
                    authFactory.identity.username = data.data.decoded.username;
                    authFactory.identity.role = data.data.decoded.role;
                }
                
            }else{ // error
                deferred.reject(console.log('token not decoded'));
                identityAuthenticated = false;
                authFactory.identity.role = 'guest';
            }  
        })
        return deferred.promise;
    }

    authFactory.decodeToken = function(){
       return $http.post('/api/active');
    }

    authFactory.parseJwtBody = function(token){
        var tokenExp = token.split('.')[1];
        return JSON.parse($window.atob(tokenExp));
    }

    authFactory.logout = function(){
        AuthToken.setToken();
    }
    //UI-Router related services
   
    return authFactory;
})

.factory('authRouterFactory', function( $rootScope, $state, Auth){
    var authRouterFactory = {};
    
    return authRouterFactory;
})