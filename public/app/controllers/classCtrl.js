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
                console.log(data.data)
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

    

}])