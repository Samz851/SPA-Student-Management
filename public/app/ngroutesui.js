var app = angular.module('edugateRoutesUI', ['ui.router', 'authService', 'classSrv', 'userService'])

.config(['$stateProvider','$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider, Auth, $timeout, $q, $state, $transitions){

	// Default
	$urlRouterProvider.otherwise("/");
	// var userRole = 'guest';
	
	var checkToken = ['Auth', '$q', function(Auth, $q){
		var deferred = $q.defer();
		if(Auth.isLoggedIn()== true) {
			deferred.resolve(true)
		} else {
			deferred.resolve(false)
		}
		return deferred.promise
	}]
	var Authenticate =	['Auth','$q',
		function(Auth, $q) { 
			var deferred = $q.defer();
				Auth.getUser().then(function(user){
					if(user){ // Promise resolved
						if(user.data.success){ //Success
							hasToken = true;
							userRole = user.data.decoded.role;
							deferred.resolve(user);
						} else{ //Fail
							hasToken = false;
							userRole = "guest";
							deferred.resolve(user);
						}
					} else { // Promise not Resolved Yet
						deferred.resolve('Promise not Resolved yet')
					}
					
				}).catch(function(){
					deferred.reject('User Error')
				});
			return deferred.promise
			
		}
	];

	$stateProvider

	.state('app', {
		// abstract: true, // makes this state not directly accessible
		views: {
			"edugate": {
				templateUrl: 'app/views/edugate.html',
				controller: 'mainCtrl',
				controllerAs: 'main',
			}
		},
		resolve: {
			Authenticate: Authenticate,
			hasToken: checkToken
		},
		data: {
			roles: ['guest', 'admin', 'instructor', 'student']
		}
	})
		.state('app.welcome', {
			url:'/',
			views: {
				"main": {
					templateUrl: "app/views/pages/home.html",
					// controller: 'mainCtrl',
					// controllerAs: 'main',
				}
			},
			data: {
				roles: ['guest', 'admin', 'instructor', 'student'],
				private: false,
			},
			resolve: {
				Authenticate: Authenticate
			}
			
		})
		.state('app.register', {
			url:'/register',
			views: {
				"main": {
					templateUrl: 'app/views/pages/register.html',
				}
			},
			data: {
				roles: ['guest'],
				private: false
			},
			resolve: {
				Authenticate: Authenticate
			}
		})
		.state('app.login', {
			url:'/login',
			views: {
				"main": {
					templateUrl: 'app/views/pages/login.html',

				}
			},
			data: {
				roles: ['guest', 'admin', 'instructor', 'student'],
				private: false
			},
			resolve: {
				Authenticate: Authenticate
			}
		})
		.state('app.logout', {
			url: '/logout',
			views: {
				"main": {
					templateUrl: 'app/views/pages/logout.html',
				}
			},
			data: {
				roles: ['admin', 'instructor', 'student','guest'],
				private: false
			},
			resolve: {
				Authenticate: Authenticate,
			}
		})
		.state('app.dashboard', {
			url: '/dashboard',
			views: {
				"main": {
					templateUrl: 'app/views/pages/administration/dashboard.html',
					controller: 'dashCtrl',
					controllerAs: 'dash'
				},
			},
			resolve: {
				Authenticate: Authenticate,
			},
			data: {
				roles: ['admin', 'instructor'],
				private: true
			}
		})
			.state('app.dashboard.addnewclass', {
				url: '/dashboard/addnewclass',
				views: {
					"dashview": {
						templateUrl: 'app/views/pages/administration/dashboard/addnewclass.html',
						controller: 'classCtrl',
						controllerAs: 'class'
					}
				},
				data: {
					roles: ['admin', 'instructor'],
					private: true
				},
				resolve: {
					Authenticate: Authenticate,
				}
			})
			.state('app.dashboard.enrollstudents', {
				url: '/dashboard/enrollstudents',
				views: {
					"dashview": {
						templateUrl: 'app/views/pages/administration/dashboard/enrollstudent.html',
						controller: 'classCtrl',
						controllerAs: 'classCtrl'
					}
				}
			})
			.state('app.dashboard.addnewstudent', {
				url: '/dashboard/addnewstudent',
				views: {
					"dashview": {
						templateUrl: 'app/views/pages/administration/dashboard/addnewstudent.html',
						controller: 'studentCtrl',
						controllerAs: 'studentCtrl'
					}
				}
			})
			.state('app.dashboard.updtstudentrec', {
				url: '/dashboard/updtstudent',
				views: {
					"dashview":{
						templateUrl: 'app/views/pages/academic/studentrecord.html',
						controller: 'studentCtrl',
						controllerAs: 'academicStd'
					}
				}
			})
			.state('app.dashboard.updatecourse', {
				url: '/dashboard/updatecourse',
				views: {
					"dashview": {
						templateUrl: 'app/views/pages/academic/updateclass.html',
						controller: 'classCtrl',
						controllerAs: 'updtClassCtrl'
					}
				}
			})
			.state('app.dashboard.marks', {
				url: '/dashboard/marks',
				views: {
					"dashview": {
						templateUrl: 'app/views/pages/academic/marks.html',
						controller: 'classCtrl',
						controllerAs: 'marksCtrl'
					}
				}
			})
		.state('app.privacy', {
			url: '/privacy',
			views: {
				"main": {
					templateUrl: 'app/views/pages/privacy.html'
				}
			},
			data: {
				roles: ['guest', 'admin', 'instructor', 'student'],
				private: false
			},
			resolve: {
				Authenticate: Authenticate
			}
		})
		.state('app.facebook', {
			url: '/facebook/:token',
			views: {
				"main": {
					templateUrl: 'app/views/pages/facebook.html',
					controller: 'fbCtrl',
					controllerAs: 'fb'
				}
			},
			data: {
				roles: ['guest', 'admin', 'instructor', 'student'],
				private: false
			}
		})
		.state('app.facebookerror', {
			url: '/facebookerror',
			views: {
				"main": {
					templateUrl: 'app/views/pages/login.html',
					controller: 'fbCtrl',
					controllerAs: 'fb'
				}
			},
			data: {
				roles: ['guest', 'admin', 'instructor', 'student'],
				private: false
			}
		})
		.state('app.about',{
			url: '/about',
			views: {
				"main": {
					templateUrl: 'app/views/pages/about.html'
				}
			},
			data: {
				roles: [ 'admin', 'instructor', 'student'],
				private: false
			},
			resolve: {
				Authenticate: Authenticate
			}
		})
		.state('app.accessdenied',{
			url:'/access-denied',
			views: {
				"main": {
					template: '<h1><strong>Restricted Area</strong></h1>',
				}
			}
		})
		.state('app.verifyemail', {
			url: '/verifyemail/:token',
			views: {
				"main": {
					templateUrl: 'app/views/pages/accountactivation.html',
            		controller: 'emailCtrl',
            		controllerAs: 'email'
				}
			},
			data: {
				roles: ['guest'],
				private: false
			}
		})
		.state('app.resetpassword', {
			url: '/resetpassword/:token',
			views: {
				"main": {
					templateUrl: 'app/views/pages/resetpage.html',
            		controller: 'emailCtrl',
            		controllerAs: 'email',
				}
			},
			data: {
				roles: ['guest', 'admin', 'instructor', 'student'],
				private: false
			}
		})

		$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
	}])
	app.run(function($transitions, Auth, $state, $q){
		
		$transitions.onStart({}, function(transition){
			var deferred = $q.defer();
			if(transition.to().data.private ){
				if(!Auth.isLoggedIn()){
					deferred.resolve($state.go('app.login'));
				} else {
					Auth.decodeToken().then(function(data){
						if(data.data.success){
							var stateRoles = transition.to().data.roles;
							var userRole = data.data.decoded.role;
							if(!stateRoles.includes(userRole)){
								deferred.resolve($state.go('app.accessdenied',{}, {reload:true}));
							}
						}else{
							deferred.resolve($state.go('app'),{}, {reload: true})
						}
						
					})
				}
			}
			return deferred;
		})
	})


