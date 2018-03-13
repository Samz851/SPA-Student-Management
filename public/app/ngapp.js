angular.module('usermgmt-ui', ['usermgmtRoutes',
                                'ngAnimate',
                                'maincontroller',
                                'authService',
                                'ngMessages',
                                'emailController',
                                'studentController'])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})