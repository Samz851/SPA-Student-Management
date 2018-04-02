angular.module('studentController', ['studentService'])

.controller('studentCtrl', function(studentFactory) {
    app = this;
    app.students = [];

    this.fetchStudents = function(){
        studentFactory.fetchStudents().then(function(data, err){
            if(data.data.success){
                app.students = data.data.student;
            } else {
                //handle error
            }
        })
    }
    this.addNewStudent = function(studentData){
        if(studentData){
            studentFactory.addNewStudent(studentData).then(function(data){
                if(data.data.success){
                    // Data loaded
                } else{
                    // handle error
                }
            })
        }
    }
    this.fetchStudentRecord = function(student){
        if(student){
            studentFactory.getStudentRec(student).then(function(data){
                if(data.data.success){
                    app.displayCard={};
                    app.displayCard.classes =[]
                    console.log(data.data)
                    app.displayCard.ID = data.data.student.studentid;
                    app.displayCard.name = data.data.student.name;
                    app.displayCard.email = data.data.student.email;
                    for(let i=0; i < data.data.final.length; i++){
                        for(let n=0; n < data.data.student.academic.length; n++){
                            if(data.data.student.academic[n]._id === data.data.final[i].courseID){
                                classCard = {course: data.data.student.academic[n].class.classCode, final: data.data.final[i].final, scores: data.data.student.academic[n].score};
                                app.displayCard.classes.push(classCard);
                            }
                        }
                    }
                    console.log(app.displayCard)
                }else{
                    // handle error
                }
            })
        }
    }
    this.enableEdit = function(){
      $('#student-record input').each(function(){
          $(this).removeAttr('readonly');
      })
    }
    this.updateRecord = function(studentID, studentName, studentEmail, card){
        console.log(card)
        recObj = {}
        recObj.ID = studentID;
        recObj.name = studentName;
        recObj.email = studentEmail;
        recObj.courses = []
        angular.forEach(card.scores, function(value, key){
            recObj.courses.unshift(value);
        })
        console.log(recObj)
        studentFactory.updateRecord(recObj)

    }
})