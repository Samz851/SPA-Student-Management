angular.module('userService',[])

.factory('userFactory', function($http){
    User = {};
    User.create = function(regData){
        return $http.post('/api/users', regData);
    }
    return User;
})
