angular.module('userService',[])

.factory('userFactory', function($http){
    var User = {};
    User.create = function(regData){
        return $http.post('/api/users', regData);
    }
    User.checkusername = function(regData){
        return $http.post('/api/checkusername', regData);
    }
    User.checkuseremail = function(regData){
        return $http.post('/api/checkuseremail', regData);
    }
    User.activateaccount = function(token){
            return $http.put('/api/verifyemail/' + token);
    };
    User.resendemail= function(email){
        return $http.put('/api/resendusername/'+ email);
        console.trace('userserv');
    }
    User.sendpasswordlink = function(email){
        return $http.put('/api/sendpasswordtoken/' + email);
    }
    User.resetpassword = function(token, data){
        return $http.post('/api/resetpassword/' + token, data);
    }
    return User;
})
