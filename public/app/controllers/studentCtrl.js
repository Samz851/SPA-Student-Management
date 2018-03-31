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
                    app.stdRec = data.data.student;
                    app.studentID = app.stdRec.studentid;
                    app.studentName = app.stdRec.name;
                    app.studentEmail = app.stdRec.email;
                    app.academicCard = app.stdRec.academic;
                    app.studentScores = app.stdRec.academic.score;
                    app.stdFinal = data.data.final;
                    console.log(app.academicCard)
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
        recObj = {}
        recObj.ID = studentID;
        recObj.name = studentName;
        recObj.email = studentEmail;
        recObj.courses = []
        angular.forEach(card, function(value, key){
            recObj.courses.unshift(value);
        })
        studentFactory.updateRecord(recObj)

    }
})