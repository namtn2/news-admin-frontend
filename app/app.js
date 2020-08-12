'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Category', []);
angular.module('News', []);
angular.module('Modals', []);
angular.module('Log', []);

angular.module('myApp', [
    'ngRoute',
    'Authentication',
    'Category',
    'News',
    'ngCookies',
    'ui.bootstrap',
    'ngMaterial',
    'ngAria',
    'ngAnimate',
    'ng.ckeditor',
    'vcRecaptcha',
    'Modals',
    'ngStorage',
    'Log'
])
        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

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
                            templateUrl: 'modules/category/category-detail.html'
                        })
                        .when('/news', {
                            controller: 'NewsController',
                            templateUrl: 'modules/news/news.html'
                        })
                        .when('/modal-news', {
                            controller: 'CreateUpdateNewsController',
                            templateUrl: 'modules/news/news-detail.html'
                        })
                        .when('/', {
                            templateUrl: 'modules/home/home.html'
                        })
                        .when('/403', {
                            templateUrl: 'modules/common/403.html'
                        })
                        .when('/log', {
                            templateUrl: 'modules/log/log.html',
                            controller: 'LogController'
                        })
                        .otherwise({redirectTo: '/login'});

                $httpProvider.interceptors.push('Interceptor');
            }])
        .run(['$rootScope', '$location', '$http', '$localStorage', 'AuthenticationService',
            function ($rootScope, $location, $http, $localStorage, AuthenticationService) {
                $rootScope.location = $location; // show-hide header footer

                $rootScope.doLogout = function () {
                    AuthenticationService.logout({email: $localStorage.currentUser.userName}, function (response) {
                        console.log(response);
                    });
                    AuthenticationService.clearCredentials();
                };

                if ($localStorage.currentUser) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
                    $rootScope.userLogin = $localStorage.currentUser.userName;
                }

                $rootScope.$on('$locationChangeStart', function (event, next, current) {
                    var publicPages = ['/login', '/register'];
                    var restrictedPage = publicPages.indexOf($location.path()) === -1; // trang hien tai ko phai login/register
                    if (restrictedPage && !$localStorage.currentUser) {
                        if ($location.$$path == '/register') {
                            $location.path($location.$$path);
                        } else {
                            $location.path("login");
                        }
                    }
                });
            }])
        ;

