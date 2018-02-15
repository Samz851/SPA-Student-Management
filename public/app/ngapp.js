angular.module('usermgmt-ui', ['usermgmtRoutes', 'userController', 'ngAnimate', 'maincontroller', 'authService', 'ngMessages'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})