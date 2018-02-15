angular.module('userController',['userService'])

//Controllers

.controller('regCtrl', function($http, $location, $timeout, userFactory, $scope) {
    var app = this;
    this.regUser = function(regData, valid) {
        app.loading = true;
        app.errorMsg=false;
        if(!valid){
            app.loading = false;
            app.errorMsg = "Please make sure the form is complete and all fields are valid before submitting...";
        }else {
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
                    app.errorMsg = data.data.message;}
        });
        }
};
    this.checkusername = function(regData){
        User.checkusername(app.regData).then(function(data){
            if(data.data.success){
                app.loading = false;
                app.successMsg = data.data.message;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
        
    };
    this.checkuseremail = function(regData){
        if(data.data.success){
            app.loading = false;
            app.successMsg = data.data.message;
        } else {
            app.loading = false;
            app.errorMsg = data.data.message;
        }
    }

// $scope.compare = function (repassword) {
//     $scope.isconfirm = $scope.password == repassword ? true : false;
//        }
})

.directive('matchPw', [function () {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        var firstPassword = regForm.userpassword;
        $(elem).add(firstPassword).on('keyup', function () {
          scope.$apply(function () {
            var v = elem.val()===$(firstPassword).val();
            ctrl.$setValidity('pwmatch', v);
          });
        });
      }
    }
  }])

.controller('fbCtrl', function($routeParams, Auth, $location, $window, $timeout){
    var app = this;
    if($window.location.pathname == '/facebookerror'){
        // $timeout(function(){
        //    
        //     $location.path('/login');
        // },2000);
        app.errorMsg = "Error: Could not match Facebook account to User in Database";
       
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/');
    }
})
