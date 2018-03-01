angular.module('usermgmt-ui', ['usermgmtRoutes', 'userController', 'ngAnimate', 'maincontroller', 'authService', 'ngMessages', 'emailController'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})