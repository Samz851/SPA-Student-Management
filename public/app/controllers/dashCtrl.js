angular.module('dashboardcontroller',['classSrv', 'chart.js','edugateRoutesUI'])

.controller('dashCtrl',['classFactory', '$q', '$timeout', function(classFactory, $q, $timeout){
    var app=this;


    app.aggClassrooms = []
    var classesObj;
    app.data=[];
    app.labels=[];


    
    this.rankStudents = function(){
        classFactory.rankStudents().then(function(data){
            app.studentMarks = data.data.marks
            function compare(a, b){
                let comparison = 0;
              
                if (a.final < b.final) {
                  comparison = 1;
                } else if (b.final < a.final) {
                  comparison = -1;
                }
              
                return comparison;
              }
              app.studentMarks.sort(compare)
              totalscore = 0;
              for(i=0; i<app.studentMarks.length; i++){
                  totalscore += app.studentMarks[i].final;

              }
              app.ave = totalscore / app.studentMarks.length;
              
        })
    }
    app.rankStudents();

    this.studentsInClassroom = function(){
        classFactory.fetchClasses().then(function(data){
            for(var index of data.data.course){
                var classroom ={};
                classroom.code = index.classCode;
                classroom.name = index.className;
                classroom.enrolled = index.enrolled.length;
                app.aggClassrooms.push(classroom);
            }
        })
    }
    app.studentsInClassroom();

    this.fitChartContainer = function(){
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
        },500)
        
    }
}])