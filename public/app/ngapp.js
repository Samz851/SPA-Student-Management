angular.module('usermgmt-ui', ['usermgmtRoutes', 'userController', 'ngAnimate', 'maincontroller', 'authService'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})