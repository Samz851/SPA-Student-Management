angular.module('maincontroller',['authService'])
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window){
    
    var app= this;
    app.loadMe = false;
    $rootScope.$on('$routeChangeStart', function(){
        if(Auth.isLoggedIn()){
            app.isLoggedIn= true;
            Auth.getUser().then(function(data){
                app.logUsername = data.data.username;
                app.logUseremail = data.data.email;
                app.loadMe = true;
            });
        } else {
            app.isLoggedIn = false;
            app.logUsername = null;
            app.loadMe = true;
        }
        if($location.hash() == '_=_') $location.hash(null);
    })
    this.fb = function(){
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
    }

    this.loginUser = function(loginData){
        app.loading = true;
        app.errorMsg = false;
        Auth.login(app.loginData).then(function(data){
            if(data.data.success){
                app.loading = false;
                //Success Message
                app.successMsg = data.data.message + "...Redirecting, please wait";
                //Timeout redirecting to homepage
                $timeout(function(){
                    $location.path('/profile');
                    app.loginData = null;
                    app.successMsg = null;
                }, 2000);
            } else {
                // Create an error message
                app.loading = false;
                app.errorMsg = data.data.message
            }

        })
    }

    this.logout = function(){
        Auth.logout();
        $timeout(function(){
            $location.path('/');
        },2000)
    }

    this.resetUsername = function(){
        
    }
    this.triggerModal = function(){
        $('#reset').modal({
            backdrop: 'static',
            keyboard: false})
    }
})

    //Password and Username Reset Controller
.controller('resetCtrl', function(userFactory, $scope, $timeout){
    $scope.loading = false;
    
    $scope.resendUsername = function(email){
        $scope.loading = true;
        userFactory.resendemail(email).then(function(data){
            console.log(data);
            if(data.success){
                $scope.loading = false;
                $scope.successMsg = data.data.message;
                $timeout(function(){
                    $('#reset').modal('hide');
                },2000)

            } else {
                $scope.loading = false;
                $scope.errorMsg = data.data.message;
            }
        })
    }
    $scope.resetPassword = function(email)
    {
        $scope.loading = true;
        userFactory.sendpasswordlink(email).then(function(data){
            console.log(data);
            if(data.success){
                $scope.loading = false;
                $scope.successMsg = data.data.message;
                $timeout(function(){
                    $('#reset').modal('hide');
                },2000)

            } else {
                $scope.loading = false;
                $scope.errorMsg = data.data.message;
            }
        })
    }
    
})