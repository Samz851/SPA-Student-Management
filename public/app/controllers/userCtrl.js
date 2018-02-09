angular.module('userController',['userService'])
.controller('regCtrl', function($http, $location, $timeout, userFactory) {
    var app = this;
    this.regUser = function(regData) {
        app.loading = true;
        app.errorMsg=false;
        User.create(app.regData).then(function(data){
           console.log(data);
           if(data.data.success){
               app.loading = false;
               app.successMsg = data.data.message + "...Redirecting Please Hold!";
               //redirect to homepage
               $timeout(function(){
                    $location.path('/');
               }, 2000);
           }else{
               app.loading = false;
               app.errorMsg = data.data.message;
           }
       });
    };
});
