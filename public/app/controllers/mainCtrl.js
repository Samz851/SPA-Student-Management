// import { resolve } from "dns";

angular.module('maincontroller',['authService'])
.controller('mainCtrl',['$scope', 'Auth','$timeout','$state','$rootScope','$window','$interval','AuthToken','userFactory','Authenticate', function($scope, Auth, $timeout, $state, $rootScope, $window, $interval, AuthToken, userFactory, Authenticate){
    
    var app= this;
    app.loadMe = false;
    app.errorMsg = "";
    app.successMsg = "";
    app.logUserRole;
    app.isLoggedIn = Auth.isLoggedIn();
    $scope.logUsername = Auth.identity.username;
    
    

    // function to set Name

    this.loadWelcome = function(){
        var divs = $('.label');
        $('.slide-left').animate({
           marginLeft: '0px'
        }, 500);
        $('.slide-right').animate({
            marginRight: '0px'
        }, 500)
    };
    this.toggleDashboardMenu = function() {
        var toggleWidth = $("#dash-menu").width() == 200 ? "50px" : "200px";
        $('#dash-menu').animate({ width: toggleWidth });
    }

    this.checkSession = function(){
        app.loadMe = true;
        app.successMsg = "";
        app.errorMsg = "";
        var interval = $interval(function(){
            var storedToken = $window.localStorage.getItem('token');
            if(storedToken === null){
                $interval.cancel(interval);
            } else {
                var parsedJwt = Auth.parseJwtBody(storedToken);
                var expTime = parsedJwt.exp;
                var timeStamp = Math.floor(Date.now()/1000);
                var difference = expTime - timeStamp;
                if(difference > 30 ){
                    console.log(difference + " : "+Auth.isLoggedIn() + " : " +$scope.logUsername);
                }
                else if(difference  > 0 && difference <= 30 ) {
                    app.triggerModal('session');
                    app.loading = false;
                    console.log('Token Expired');
                } else {
                    app.loading = false;
                    $scope.logUsername = null;
                    Auth.logout();
                    app.errorMsg = "Goodbye!"
                    $timeout(function(){
                        app.errorMsg = "";
                        $('#session').modal('hide');
                        $state.go('/', null, {inherit: false});
                    }, 2000);
                }
                
            }
        }, 2000)
    }

    
    this.getName = function(){
        if(Authenticate.data.success){
            $scope.logUsername = Auth.identity.username;
        } else {
            //
        }
    }
    app.getName();
        //Function to renew user credentials on state change -- DEPRECATED
    
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
                $scope.logUsername = data.data.username;
                app.logUserRole = data.data.role;
                console.log('login username is: ' + data.data.role)
                $state.reload() // relaod parent state
                //Timeout redirecting to homepage
                $timeout(function(){
                    // $location.path('/profile');
                    $state.go("app.dashboard");
                    app.loginData = null;
                    app.successMsg = null;
                    app.checkSession();
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
            $state.go("app.welcome",{}, {reload: true});
        },2000);
    }

    this.triggerModal = function(dom){
        var id = '#'+dom;
        $(id).modal({
            backdrop: 'static',
            keyboard: false})
    }
    this.sessionLogout = function(){
        Auth.logout();
        AuthToken.setToken();
        this.loading = false;
        this.errorMsg = "Thank you for your visit";
        $timeout(function(){
            $state.go('/');
            $('#session').modal('hide');
        }, 500)
    }

    //Renew session
    this.renewSession = function(){
        this.loading = true;
        // Function to retrieve a new token for the user
        userFactory.renewSession($scope.logUsername).then(function(data) {
            // Check if token was obtained
            if (data.data.success) {
                AuthToken.setToken();
                AuthToken.setToken(data.data.token); // Re-set token
                app.loading = false;
                app.successMsg = "Enjoy!";
                $timeout(function(){
                    $('#session').modal('hide');
                }, 1000)
            } else {
                app.loading = false;
                app.errorMsg = "Session renewal failed, please login"
                $timeout(function(){
                    $('#session').modal('hide');
                    $state.go('/login')
                }, 1000)
            }
        });
    }
}])
    //Password and Username Reset Controller
.controller('resetCtrl', function(userFactory, $scope, $timeout, $location, Auth, AuthToken){
    var app = this;
    this.loading = false;
    
    this.resendUsername = function(email){
        this.loading = true;
        userFactory.resendemail(email).then(function(data){
            if(data.data.success){
                app.loading = false;
                app.successMsg = data.data.message;
                $timeout(function(){
                    $('#reset').modal('hide');
                },6000)
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    }
    this.resetPassword = function(email)
    {
        this.loading = true;
        userFactory.sendpasswordlink(email).then(function(data){
            if(data.success){
                this.loading = false;
                this.successMsg = data.data.message;
                $timeout(function(){
                    $('#reset').modal('hide');
                },2000)

            } else {
                this.loading = false;
                this.errorMsg = data.data.message;
            }
        })
    }

    
})
// .run('$transitions','$state', function($transitions){
//     $transitions.onSuccess({}, function(transition){
//         console.log(
//             "successful Transition from " +transition.from().name+
//             "to" +transition.to().name
//         )
//     })
// })