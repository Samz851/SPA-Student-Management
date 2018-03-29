angular.module('edugate', ['edugateRoutesUI',
                                'ngAnimate',
                                'authService',
                                'maincontroller',
                                'ngMessages',
                                'ngMaterial',
                                'emailController',
                                'studentController',
                                'userController',
                                'authTokenFactory',
                                'classcontroller',
                                'classSrv'
                                ])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})