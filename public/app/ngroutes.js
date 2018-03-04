var app = angular.module('usermgmtRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'app/views/pages/home.html'
        })
        .when('/about', {
            templateUrl: 'app/views/pages/about.html'
        })
        .when('/contact', {
            templateUrl: 'app/views/pages/contact.html'
        })
        .when('/register', {
            templateUrl: 'app/views/pages/register.html',
            controller: 'regCtrl',
            controllerAs: 'register',
            loggedIn: false
        })
        .when('/login', {
            templateUrl: 'app/views/pages/login.html',
            loggedIn: false
        })
        .when('/logout',{
            templateUrl: 'app/views/pages/logout.html',
            loggedIn: true
        })
        .when('/profile', {
            templateUrl: 'app/views/pages/profile.html',
            loggedIn: true
        })
        .when('/privacy', {
            templateUrl: 'app/views/pages/privacy.html'
        })
        .when('/facebook/:token',{
            templateUrl: 'app/views/pages/facebook.html',
            controller: 'fbCtrl',
            controllerAs: 'fb',
            loggedIn: false
        })
        .when('/facebookerror',{
            templateUrl: 'app/views/pages/login.html',
            controller: 'fbCtrl',
            controllerAs: 'fb',
            loggedIn: false
        })
        .when('/verifyemail/:token',{
            templateUrl: 'app/views/pages/accountactivation.html',
            controller: 'emailCtrl',
            controllerAs: 'email',
            loggedIn: false
        })
        .when('/resetpassword/:token',{
            templateUrl: 'app/views/pages/resetpage.html',
            controller: 'emailCtrl',
            controllerAs: 'email',
            loggedIn: false
        })
        .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location, user){
    // Check on route change
    $rootScope.$on('$routeChangeStart', function(event, next, current,){
        
        //Limit check to required routes
        if(next.$$route !== undefined){
            //Check if authentication is required
            if(next.$$route.loggedIn === true) {
                if(!Auth.isLoggedIn()){
                    event.preventDefault();
                    $location.path('/');
                }
            } else if (next.$$route.authenticated === false){
                // If no authentication required, prevent access to logged in users
                if (Auth.isLoggedIn()){
                    event.preventDefault();
                    $location.path('/profile');
                }
            }
        }
    })
}])
