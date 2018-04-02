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
    classFactory.fetchClass = function(code) {
        return $http.get('/api/adminapi/getclass/'+code)
    }
    classFactory.updateClassRec = function(update){
        return $http.put('/api/adminapi/updateclass', update)
    }
    classFactory.submitMark = function(scoreCard){
        return $http.post('/api/adminapi/submitmark', scoreCard)
    }
    classFactory.rankStudents = function(){
        return $http.get('/api/adminapi/allmarks')
    }
    return classFactory;
})