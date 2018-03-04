angular.module('maincontroller',['authService'])
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, AuthToken, userFactory){
    
    var app= this;
    app.loadMe = false;
    app.errorMsg = "";
    app.successMsg = "";

    this.checkSession = function(){
        if(Auth.isLoggedIn()){
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
                        console.log(difference);
                    }
                    else if(difference  > 0 && difference <= 30 ) {
                        app.triggerModal('session');
                        app.loading = false;
                        console.log('Token Expired');
                    } else {
                        app.loading = false;
                        Auth.logout();
                        app.errorMsg = "Goodbye!"
                        $timeout(function(){
                            app.errorMsg = "";
                            $('#session').modal('hide');
                            $location.path('/');
                        }, 2000);
                    }
                    
                }
            }, 2000)
        }
    }
    app.checkSession();
    
    //Function to renew session

   
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
                app.checkSession();
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
            $location.path('/');
            $('#session').modal('hide');
        }, 500)
    }

    //Renew session
    this.renewSession = function(){
        this.loading = true;
        // Function to retrieve a new token for the user
        userFactory.renewSession(app.logUsername).then(function(data) {
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
                    $location.path('/login')
                }, 1000)
            }
        });
    }
})

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