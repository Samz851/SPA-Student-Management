angular.module('classcontroller',['classSrv'])

.controller('classCtrl',['classFactory', '$q', function(classFactory, $q){
    var app=this;

    this.addNewClass = function(classData){
        if(classData){
            classFactory.addClass(classData)
            console.log(classData)
        } else {
            console.log('Cannot call class service')
        }

        console.log(classData);
            this.message = "Button works"
        
    };
    this.fetchClasses = function(){
        classFactory.fetchClasses().then(function(data, err){
            if(data.data.success){
                app.classes = data.data.course;
            } else {
                console.log("could not load student module:\n"+err)
            }
        })
    }

    this.addtoClass = function(classid, studentid){
        let enrollData = {
            coursecode: classid,
            studentid: studentid
        }
        classFactory.addToClass(enrollData);
        // .then(function(data){
        //     if(data.data.success){
        //         console.log('student: '+studentid+' has been enrolled in '+classid);
        //     } else {
        //         console.log('failed to enroll student');
        //     }
        // })
        console.log(classid+' : '+studentid);
        
    }
    // Update Course controller
    this.fetchClass = function(code) {
        
        code = code.toUpperCase();
        classFactory.fetchClass(code).then(function(data){
            if(data.data.success){
                console.log(JSON.stringify(data.data.card))
                date = data.data.card.classStart;
                app.card = data.data.card;
                app.card.classStart = new Date(date);
                
                console.log('The date is: '+JSON.stringify(date) +'\n with the type of:' +typeof app.card.classStart)
            } else {
                app.errMsg = data.data.message;
                console.log(data.data.message)
            }
            console.log('The Card is: ' +JSON.stringify(app.card))
            
        })
    }
    this.updateClassRec = function(update){
        console.log('update rec ' +JSON.stringify(update))
        classFactory.updateClassRec(update).then(function(data){
            if(data.data.success){
                console.log('Class Record Update')
            }else{
                console.log('Class Record Failed to Update')
            }
        })
    }

    // Marks controller
    this.loadClasses = function(){
        classFactory.fetchClasses().then(function(data, err){
            if(data.data.success){
                app.classes = data.data.course;
                console.log(data.data)
            } else {
                console.log("could not load student module:\n"+err)
            }
        })
    }
    this.getClassMarks = function(classroom){
        console.log('the course Code is: '+JSON.stringify(classroom));
        // code = code.toUpperCase();
        classFactory.fetchClass(classroom.classCode).then(function(data){
            if(data.data.success){
                console.log("the data is "+JSON.stringify(data.data.card.enrolled))
                app.classroom = data.data.card.enrolled
            } else {
                app.errMsg = data.data.message;
                console.log(data.data.message)
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
        console.log('the score card is: ' + JSON.stringify(scoreCard))
    }
    

}])