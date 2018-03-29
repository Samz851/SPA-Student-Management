angular.module('classSrv',[])

.factory('classFactory', function($http){
    classFactory = {}
    classFactory.addClass = function(classData){
        return $http.post('/api/adminapi/addnewclass', classData)
    }
    classFactory.fetchClasses = function(){
        return $http.get('/api/adminapi/classlist')
    }
    classFactory.addToClass = function(enrollData){
        return $http.post('/api/adminapi/addtoclass', enrollData);
    }
    return classFactory;
})