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
                    $location.path('/about');
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
})