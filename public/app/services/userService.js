angular.module('userService',[])

.factory('userFactory', function($http){
    User = {};
    User.create = function(regData){
        return $http.post('/api/users', regData);
    }
    User.checkusername = function(regData){
        return $http.post('/api/checkusername', regData);
    }
    User.checkuseremail = function(regData){
        return $http.post('/api/checkuseremail', regData);
    }
    User.sendverifyemail = function(regData){
        return $http.post('/api/sendactivation', regData);
    }
    return User;
})
