angular.module('studentService',[])

.factory('studentFactory', function($http){
    var Student = {};

    Student.fetchStudents = function(){
       return $http.get('/api/allstudents');
    }
    Student.addNewStudent = function(studentData){
        return $http.post('/api/adminapi/addnewstudent', studentData)
    }
    Student.getStudentRec = function(student){
        return $http.get('/api/adminapi/getstdrec/'+student)
    }
    Student.updateRecord = function(record){

        console.log('StudentFactory record is: '+JSON.stringify(record))

        return $http.put('/api/adminapi/updatestdrec', record)
    }
    return Student;
})