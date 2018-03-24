angular.module('studentService',[])

.factory('studentFactory', function($http){
    var Student = {};

    Student.fetchStudents = function(){
       return $http.get('/api/allstudents');
    }
    Student.addToClass = function( student, supervisor ){
        var data = ({studentname: student,
                    supervisorname: supervisor});
        console.log(student);
        console.log(supervisor);
        return $http.post('/api/addtoclass', data);
    }
    return Student;
})