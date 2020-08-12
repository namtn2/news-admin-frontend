'use strict';

angular.module('Authentication')

        .factory('AuthenticationService',
                ['$http', '$cookieStore', '$rootScope', 'CommonController', '$localStorage', '$location', '$timeout',
                    function ($http, $cookieStore, $rootScope, CommonController, $localStorage, $location, $timeout) {
                        var service = {};
                        var api = 'http://localhost:8080/user/';

                        service.login = function (data, callback) {

                            $http({
                                method: 'post',
                                url: api + 'login',
                                data: data
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying login');
                            });
                        };

                        service.loginGoogle = function (data, callback) {

                            $http({
                                method: 'post',
                                url: api + 'login-google',
                                data: data
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying to login with google');
                            });
                        };

                        service.registerGoogle = function (idToken, callback) {

                            $http({
                                method: 'post',
                                url: api + 'register-google',
                                data: idToken
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying to registry with google');
                            });
                        };

                        service.validateCaptcha = function (idToken, callback) {

                            $http({
                                method: 'post',
                                url: api + 'g-captcha',
                                data: idToken
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying to connect to service');
                            });
                        };

                        service.register = function (user, callback) {

                            $http({
                                method: 'post',
                                url: api + 'create',
                                data: user
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying to registration');
                            });
                        };

                        service.logout = function (user, callback) {

                            $http({
                                method: 'post',
                                url: api + 'logout',
                                data: user
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying to call api logout');
                            });
                        };

                        service.refreshToken = function (object) {
                            $http({
                                method: 'post',
                                url: api + 'refreshToken',
                                data: object
                            }).then(function (response) {
                                $rootScope.dataLoading = true;

                                if (response.data.key == 'SUCCESS') {
                                    service.setCredentials(response.data.object);
                                } else {
                                    service.clearCredentials();
                                }
                                $rootScope.dataLoading = false;
                            }, function (error) {
                                CommonController.showNotiDanger('Error while trying to call api refresh token');
                            });
                        };

                        service.setCredentials = function (object) {
                            $http.defaults.headers.common.Authorization = 'Bearer ' + object.token;
                            $localStorage.currentUser = {
                                token: object.token,
                                refreshToken: object.refreshToken,
                                userName: object.email
                            };
                            $rootScope.userLogin = object.email;
                        };

                        service.clearCredentials = function () {
                            $http.defaults.headers.common.Authorization = '';
                            delete $localStorage.currentUser;
                            $rootScope.userLogin = '';
                            $location.path('login');
                        };

                        return service;
                    }])
        ;

