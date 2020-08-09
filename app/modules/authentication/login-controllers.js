'use strict';

angular.module('Authentication')

        .controller('LoginController',
                ['$scope', '$rootScope', '$location', 'AuthenticationService', 'Constants', 'vcRecaptchaService', '$timeout','CommonController',
                    function ($scope, $rootScope, $location, AuthenticationService, Constants, vcRecaptchaService, $timeout, CommonController) {
                        // reset login status
                        AuthenticationService.ClearCredentials();

                        var vm = $scope;

                        vm.rememberMe = true;

                        vm.doLogin = function () {
                            if (vcRecaptchaService.getResponse() === "") {
                                vm.showNotiDanger("Please resolve the captcha and submit!");
                                return;
                            }
                            AuthenticationService.validateCaptcha(vcRecaptchaService.getResponse(), function (response) {
                                if (response.key === "SUCCESS") {
                                    AuthenticationService.login(vm.email, vm.password, function (response) {
                                        if (response.key === "SUCCESS") {
                                            AuthenticationService.SetCredentials(response.object);
                                            $location.path('/');
                                        } else {
                                            CommonController.showNotiDanger(response.message);
                                        }
                                    });
                                } else {
                                    CommonController.showNotiDanger(response.message);
                                }
                            });
                        };

                        $timeout(function () {
                            vm.googleInit();
                        }, 1000);

                        var auth2;
                        vm.googleInit = function () {
                            if (typeof gapi !== "undefined" && gapi !== null) {
                                gapi.load('auth2', function () {
                                    auth2 = gapi.auth2.init({
                                        client_id: Constants.GLOGIN.CLIENT_ID,
                                        cookiepolicy: 'single_host_origin',
                                        scope: Constants.GLOGIN.SCOPE_GOOGLE
                                    });
                                    vm.attachSignin(document.getElementById('googleBtn'));
                                });
                            }
                        };

                        vm.attachSignin = function (element) {
                            auth2.attachClickHandler(element, {}, function (googleUser) {
                                AuthenticationService.loginGoogle(googleUser.getAuthResponse().id_token, function (response) {
                                    if (response.key === "SUCCESS") {
                                        AuthenticationService.SetCredentials(response.object);
                                        $location.path('/');
                                    } else {
                                        CommonController.showNotiDanger(response.message);
                                    }
                                });
                            }, function (error) {
                                CommonController.showNotiDanger(error);
                            });
                        };

                        vm.doRegister = function () {
                            $location.path('register');
                        };

                        $rootScope.rememberUserCookie = true;
                        vm.changeValue = function () {
                            $rootScope.rememberUserCookie = vm.rememberMe;
                        };
                    }]);