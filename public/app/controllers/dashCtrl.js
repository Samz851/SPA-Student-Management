angular.module('dashboardcontroller',['classSrv', 'chart.js','edugateRoutesUI'])

.controller('dashCtrl',['classFactory', '$q', 'logging', '$timeout', function(classFactory, $q, logging, $timeout){
    var app=this;
    console.log(logging)

    app.aggClassrooms = []
    app.data=[];
    app.labels=[];
    console.log(app.aggClassrooms)

    this.studentsInClassroom = function(){
        classFactory.fetchClasses().then(function(data){
            // console.log('fecthed classes are: ' + JSON.stringify(data.data))

            for(var index of data.data.course){
                // console.log(index.classCode)
                // console.log(index.enrolled.length)
                var classroom ={};
                classroom.code = index.classCode;
                classroom.name = index.className;
                classroom.enrolled = index.enrolled.length;
                app.aggClassrooms.push(classroom);
            }
            console.log(app.aggClassrooms)
        })
    }
    app.studentsInClassroom();

    this.fitChartContainer = function(){
    //    var canvas =  $('#classrooms-chart');
       var canvas = document.getElementById("classrooms-chart");
       canvas.width = $("#second-chart-parent").width();
       canvas.height = $("#second-chart-parent").height();
    }

    this.loadCharts = function(){
        $timeout(function(){
            for(var index of app.aggClassrooms){
                app.data.push(index.enrolled);
                app.labels.push(index.name);
            }
            console.log('dataset is: '+app.data)
            console.log('labelsset is: '+app.labels)
        },500)
        
    }
}])