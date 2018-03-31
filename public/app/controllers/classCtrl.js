angular.module('classcontroller',['classSrv'])

.controller('classCtrl',['classFactory', '$q', function(classFactory, $q){
    var app=this;

    this.addNewClass = function(classData){
        if(classData){
            classFactory.addClass(classData).then(function(err){
                // handle error
            })
        } else {
            // handle empty input
        }
            this.message = "Button works"
    };

    this.fetchClasses = function(){
        classFactory.fetchClasses().then(function(data, err){
            if(data.data.success){
                app.classes = data.data.course;
            } else {
                // handle error
            }
        })
    }

    this.addtoClass = function(classid, studentid){
        let enrollData = {
            coursecode: classid,
            studentid: studentid
        }
        classFactory.addToClass(enrollData).then(function(err){
            // handle response
        })
        
    }
    // Update Course controller
    this.fetchClass = function(code) {
        code = code.toUpperCase();
        classFactory.fetchClass(code).then(function(data){
            if(data.data.success){
                date = data.data.card.classStart;
                app.card = data.data.card;
                app.card.classStart = new Date(date);
            } else {
                app.errMsg = data.data.message;
            }            
        })
    }
    this.updateClassRec = function(update){
        classFactory.updateClassRec(update).then(function(data){
            if(data.data.success){
            }else{
            }
        })
    }

    // Marks controller
    this.loadClasses = function(){
        classFactory.fetchClasses().then(function(data, err){
            if(data.data.success){
                app.classes = data.data.course;
            } else {
                // handle error
            }
        })
    }
    this.getClassMarks = function(classroom){
        classFactory.fetchClass(classroom.classCode).then(function(data){
            if(data.data.success){
                app.classroom = data.data.card.enrolled
            } else {
                app.errMsg = data.data.message;
            }
        })
    }
    this.submitMark = function(name, mark, type, classroom){
        scoreCard = {
            classroom : classroom,
            name: name,
            mark: mark,
            type: type
        }
        classFactory.submitMark(scoreCard).then(function(data){
        })
    }
    

}])