angular.module('classcontroller',['classSrv'])

.controller('classCtrl',['$state','classFactory', '$q', '$timeout', function($state, classFactory, $q, $timeout){
    var app=this;
    app.allowEdit = false;
    app.added = false;

    //modal control //
    this.triggerLoading = function(dom){
            var id = '#'+dom;
            $(id).modal('toggle')
    }
    
    this.editable = function(){
        app.allowEdit = true;
    }
    
    this.addNewClass = function(classData){
        if(classData){
            classFactory.addClass(classData).then(function(err){
                // handle error
                $state.reload();

            })
        } else {
            // handle empty input
        }
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
    app.studentAdded;
    app.toClass;

    this.addtoClass = function(classid, studentid, classCode){
        app.triggerLoading('loading');
        let enrollData = {
            coursecode: classid,
            studentid: studentid,
            classCode: classCode,
        }
        classFactory.addToClass(enrollData).then(function(err){
            app.studentAdded = enrollData.studentid;
            app.toClass = enrollData.classCode;
                $timeout(function(){
                    $('#loading').modal('hide');
                    $('#enrollment input').val('');
                    app.added = true;
                }, 1000)
                
        })
        
    }
    // Update Course controller
    this.fetchClass = function(code) {
        app.triggerLoading('loading');
        code = code.toUpperCase();
        classFactory.fetchClass(code).then(function(data){
            $timeout(function(){
                if(data.data.success){
                    $('#loading').modal('hide');
                    app.code = '';
                    date = data.data.card.classStart;
                    app.card = data.data.card;
                    app.card.classStart = new Date(date);
                } else {
                    $('#loading').modal('hide');
                    app.errMsg = data.data.message;
                }
            },500)
                        
        })
    }
    this.updateClassRec = function(update){
        let rec = update
        app.triggerLoading('loading');
        classFactory.updateClassRec(update).then(function(data){
            $timeout(function(){
                if(data.data.success){
                    app.allowEdit = false;
                    $('#loading').modal('hide');
                    app.updatesuccessMsg = data.data.message;
                }else{ }
            },500)
            
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
                app.classroom = data.data.card.enrolled;
            } else {
                app.errMsg = data.data.message;
            }
        })
    }
    this.filterClass = function(filterName){
        app.filterKey = filterName;
        app.filterName = '';
    }
    this.submitMark = function(name, mark, type, classroom){
        app.triggerLoading('loading');
        scoreCard = {
            classroom : classroom._id,
            name: name,
            mark: mark,
            type: type
        }
        classFactory.submitMark(scoreCard).then(function(data){
            if(data.data.success){
                $('#loading').modal('hide');
                app.marksMsg = data.data.message;
            } else {
                $('#loading').modal('hide');
            }
        })
    }
    

}])