'use strict';

angular.module('Authentication')

        .controller('LoginController',
                ['$location', 'AuthenticationService', 'Constants', 'vcRecaptchaService', '$timeout', 'CommonController', '$scope', '$rootScope',
                    function ($location, AuthenticationService, Constants, vcRecaptchaService, $timeout, CommonController, $scope, $rootScope) {
                        // reset login status
//                        service.clearCredentials();

                        var vm = $scope;

                        vm.rememberMe = true;
                        $rootScope.dataLoading = false;

                        vm.doLogin = function () {
                            if (vcRecaptchaService.getResponse() === "") {
                                CommonController.showNotiDanger("Please resolve the captcha and submit!");
                                return;
                            }
                            AuthenticationService.validateCaptcha(vcRecaptchaService.getResponse(), function (response) {
                                if (response.key === "SUCCESS") {
                                    $rootScope.dataLoading = true;
                                    var div = $('div.modal.fade');
                                    $(div).removeClass('fade');

                                    var loginPage = $('div.login-box');
                                    $(loginPage).css({"opacity": "0.5"});

                                    var data = {
                                        email: vm.email,
                                        password: vm.password,
                                        rememberMe: vm.rememberMe
                                    };

                                    AuthenticationService.login(data, function (response) {
                                        if (response.key === "SUCCESS") {
                                            AuthenticationService.setCredentials(response.object);
                                            $location.path('/');
                                        } else {
                                            CommonController.showNotiDanger(response.message);
                                        }
                                        $rootScope.dataLoading = false;
                                        $(loginPage).removeAttr("style");
                                    });
                                } else {
                                    CommonController.showNotiDanger(response.message);
                                    $(loginPage).removeAttr("style");
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
                                $rootScope.dataLoading = true;
                                var div = $('div.modal.fade');
                                $(div).removeClass('fade');

                                var loginPage = $('div.login-box');
                                $(loginPage).css({"opacity": "0.5"});

                                var data = {
                                    token: googleUser.getAuthResponse().id_token,
                                    remeberMe: vm.rememberMe
                                };
                                AuthenticationService.loginGoogle(data, function (response) {
                                    if (response.key === "SUCCESS") {
                                        AuthenticationService.setCredentials(response.object);
                                        $location.path('/');
                                    } else {
                                        CommonController.showNotiDanger(response.message);
                                    }
                                    $rootScope.dataLoading = false;
                                    $(loginPage).removeAttr("style");
                                });
                            }, function (error) {
                                CommonController.showNotiDanger(error);
                            });
                        };

                        vm.doRegister = function () {
                            $location.path('register');
                        };
                    }]);