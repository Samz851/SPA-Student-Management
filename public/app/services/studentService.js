angular.module('studentService',[])

.factory('studentFactory', function($http){
    var Student = {};

    Student.fetchStudents = function(){
       return $http.get('/api/allstudents');
    }
    Student.addToClass = function( student ){
        var data = ({name: student});
        console.log(student);
        return $http.post('/api/addtoclass', data);
    }
    return Student;
})