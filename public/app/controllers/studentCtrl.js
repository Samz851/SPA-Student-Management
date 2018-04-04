angular.module('studentController', ['studentService'])

.controller('studentCtrl', ['studentFactory','$timeout', function(studentFactory, $timeout) {
    app = this;
    app.students = [];
    app.registered = false;

    this.triggerLoading = function(dom){
        var id = '#'+dom;
        $(id).modal('toggle')
    }

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
        app.triggerLoading('loading');
        if(studentData){
            studentFactory.addNewStudent(studentData).then(function(data){
                if(data.data.success){
                    $timeout(function(){
                        app.successMsg = 'Student Registered Successfully';
                        app.registered = true;
                        $('#loading').modal('hide');
                        $('.form input').val('')
                    },500)
                    // Data loaded
                } else{
                    // handle error
                }
            })
        }
    }
    this.fetchStudentRecord = function(student){
        app.triggerLoading('loading');
        $('#fetch').val('');
        if(student){
            studentFactory.getStudentRec(student).then(function(data){
                $timeout(function(){
                    if(data.data.success){
                        
                        app.displayCard={};
                        app.displayCard.classes =[]
                        app.displayCard.ID = data.data.student.studentid;
                        app.displayCard.name = data.data.student.name;
                        app.displayCard.email = data.data.student.email;
                        for(let i=0; i < data.data.final.length; i++){
                            for(let n=0; n < data.data.student.academic.length; n++){
                                if(data.data.student.academic[n].class.classCode === data.data.final[i].courseID){
                                    classCard = {course: data.data.student.academic[n].class.classCode, final: data.data.final[i].final, scores: data.data.student.academic[n].score};
                                    app.displayCard.classes.push(classCard);
                                }
                            }
                        }
                        $('#loading').modal('hide');
    
                    }else{
                        // handle error
                    }
                },500)
            })
        }
    }
    this.enableEdit = function(){
      $('#student-record input').each(function(){
          $(this).removeAttr('readonly');
      })
    }

    this.disableEdit = function(){
        $('#student-record input').each(function(){
            $(this).prop('readonly', true);
        })
      }

    this.updateRecord = function(studentID, studentName, studentEmail, card){
        app.triggerLoading('loading');
        app.disableEdit();
        recObj = {}
        recObj.ID = studentID;
        recObj.name = studentName;
        recObj.email = studentEmail;
        recObj.courses = []
        angular.forEach(card.scores, function(value, key){
            recObj.courses.unshift(value);
        })
        studentFactory.updateRecord(recObj).then(function(data){
            if(data.data.success){
                app.successMsg = data.data.message;
                $timeout(function(){
                    $('#loading').modal('hide');
                    app.disableEdit();
                    app.updatesuccessMsg = data.data.message;
                }, 500)
            }
        })

    }
}])