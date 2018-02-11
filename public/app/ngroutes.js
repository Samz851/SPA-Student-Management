angular.module('usermgmtRoutes',['ngRoute'])

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
            controllerAs: 'register'
        })
        .when('/login', {
            templateUrl: 'app/views/pages/login.html'
        })
        .when('/logout',{
            templateUrl: 'app/views/pages/logout.html'
        })
        .when('/profile', {
            templateUrl: 'app/views/pages/profile.html'
        })
        .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
});