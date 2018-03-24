angular.module('edugate', ['edugateRoutesUI',
                                'ngAnimate',
                                'authService',
                                'maincontroller',
                                'ngMessages',
                                'emailController',
                                'studentController',
                                'userController',
                                'authTokenFactory'
                                ])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})