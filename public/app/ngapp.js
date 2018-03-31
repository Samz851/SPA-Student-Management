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
                                'classSrv',
                                'dashboardcontroller',
                                'chart.js'
                                ])
.config(function($httpProvider){
    $httpProvider.interceptors.push('authInterceptors');

})