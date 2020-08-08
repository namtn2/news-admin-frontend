'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Category', []);
angular.module('CreateUpdateCategory', []);
angular.module('News', []);
angular.module('CreateUpdateNews', []);
angular.module('Register', []);

angular.module('myApp', [
    'ngRoute',
    'Authentication',
    'Category',
    'CreateUpdateCategory',
    'News',
    'CreateUpdateNews',
    'Register',
    'ngCookies',
    'ui.bootstrap',
    'ngMaterial',
    'ngAria',
    'ngAnimate',
    'ng.ckeditor',
    'vcRecaptcha'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

        $routeProvider
                .when('/login', {
                    controller: 'LoginController',
                    templateUrl: 'modules/authentication/login.html'
                })
                .when('/register', {
                    controller: 'RegisterController',
                    templateUrl: 'modules/authentication/register.html'
                })
                .when('/category', {
                    controller: 'CategoryController',
                    templateUrl: 'modules/category/category.html'
                })
                .when('/modal-category', {
                    controller: 'CreateUpdateCategoryController',
                    templateUrl: 'modules/category/create-update-category.html'
                })
                .when('/news', {
                    controller: 'NewsController',
                    templateUrl: 'modules/news/news.html'
                })
                .when('/modal-news', {
                    controller: 'CreateUpdateNewsController',
                    templateUrl: 'modules/news/create-update-news.html'
                })
                .when('/', {
                    templateUrl: 'modules/home/home.html'
                })
                .otherwise({redirectTo: '/login'});
    }])
        .run(['$rootScope', '$location', '$cookieStore', '$http', 'Constants',
            function ($rootScope, $location, $cookieStore, $http, Constants) {
                // keep user logged in after page refresh
                
                $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
                }

                $rootScope.location = $location;

                $rootScope.$on('$locationChangeStart', function (event, next, current) {
                    // redirect to login page if not logged in
                    if ($rootScope.globals) {
                        if ($rootScope.globals.expiresTime < new Date()) {
                            $rootScope.globals = {};
                            $http.defaults.headers.common.Authorization = 'Basic ';
                            if ($cookieStore.get('globals')) {
                                $cookieStore.remove('globals');
                            }
                            $(document).Toasts('create', {
                                class: 'bg-danger',
                                title: 'Your session is expired. Please login again!',
                                autohide: true,
                                delay: 3000
                            });
                        }
                    }

                    if (!$rootScope.globals.currentUser) {
                        if ($location.path() == '/register') {
                            $location.path('register');
                        } else if ($location.path() == '/') {
                            $location.path('login');
                        } else {
                            $location.path('login');
                        }
                    } else {
                        $rootScope.userLogin = $rootScope.globals.currentUser.name;
                        if ($location.path() !== '/login' || $location.path() !== '/register') {
                            $location.path($location.$$path);
                        }
                    }
                });

                $rootScope.doLogout = function () {
                    $rootScope.globals = {};
                    $cookieStore.remove('globals');
                    $location.path('login');
                };

                $rootScope.showNotiDanger = function (message) {
                    $(document).Toasts('create', {
                        class: 'bg-danger',
                        title: message,
                        autohide: true,
                        delay: 3000
                    });
                };

                $rootScope.showNotiCondition = function (condition, messageSuccess, messageFail) {
                    $(document).Toasts('create', {
                        class: condition === "SUCCESS" ? 'bg-success' : 'bg-danger',
                        title: condition === "SUCCESS" ? messageSuccess : messageFail,
                        autohide: true,
                        delay: 3000
                    });
                };

                $rootScope.publicKeyCaptcha = Constants.GCAPTCHA.SITE_KEY;

            }])
        .constant('Constants', {
            'GLOGIN': {
                'CLIENT_ID': '785259876868-92a13mgl9gpe2i0knu2budtum9ov6edi.apps.googleusercontent.com',
                'CLIENT_SECRET': 'x_GleC5WyJIb5-GUmIY0Csua',
                'SCOPE_GOOGLE': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            },
            'GCAPTCHA': {
                'SITE_KEY': '6Lfxp7sZAAAAAGMLFY8CpWZ_pl1sqBH8jxaYfv2h',
                'SECRET_KEY': '6Lfxp7sZAAAAADa5_Io1L6yFW9OOvYkPmRBab52M'
            }
        })
        ;

