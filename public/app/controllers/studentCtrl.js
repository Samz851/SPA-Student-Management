angular.module('studentController', ['studentService'])

.controller('studentCtrl', function(studentFactory) {
    app = this;
    app.students = [];

    this.fetchStudents = function(){
        studentFactory.fetchStudents().then(function(data, err){
            if(data.data.success){
                app.students = data.data.student;
            } else {
                console.log("could not load student module:\n"+err)
            }
    })
    this.addToClass = function(studentName){
        studentFactory.addToClass(studentName).then(function(err){
            if(err){
                app.show = "failed to add class";
            } else {
                //hide student data
                app.show = "Student added to class";
            }
        })
    }
}
})