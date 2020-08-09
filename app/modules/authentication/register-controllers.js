'use strict';

angular.module('Authentication')

        .controller('RegisterController',
                ['$scope', '$location', 'AuthenticationService', 'Constants', 'vcRecaptchaService', '$timeout', 'CommonController',
                    function ($scope, $location, AuthenticationService, Constants, vcRecaptchaService, $timeout, CommonController) {

                        var vm = $scope;

                        vm.object = {
                            name: '',
                            email: '',
                            phone: null,
                            password: '',
                            retypePassword: ''
                        };

                        vm.check = function () {
                            vm.matchPassword();
                        };

                        vm.matchPassword = function () {
                            if (vm.object.retypePassword != vm.object.password) {
                                document.getElementById('iretypePassword').focus();
                                CommonController.showNotiDanger('Password must be matching !');
                                return false;
                            }
                            return true;
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
                                    vm.attachSignin(document.getElementById('googleBtnRegis'));
                                });
                            }
                        };

                        vm.attachSignin = function (element) {
                            auth2.attachClickHandler(element, {}, function (googleUser) {
                                AuthenticationService.registerGoogle(googleUser.getAuthResponse().id_token, function (response) {
                                    if (response.key === "SUCCESS") {
                                        if (response.object.id == null) {
                                            vm.object.name = response.object.name;
                                            vm.object.email = response.object.email;
                                        } else {
                                            CommonController.showNotiDanger('You already sign up with this email. Please sign up with another email or sign in with this email !');
                                        }
                                    } else {
                                        CommonController.showNotiDanger('Error occur while getting your information from Google !');
                                    }
                                });
                            }, function (error) {
                                CommonController.showNotiDanger(error);
                            });
                        };

                        vm.doRegister = function () {
                            var b = vm.matchPassword();
                            if (b == false) {
                                return;
                            }
                            if (vcRecaptchaService.getResponse() === "") {
                                CommonController.showNotiDanger("Please resolve the captcha and submit!");
                                return;
                            }
                            AuthenticationService.validateCaptcha(vcRecaptchaService.getResponse(), function (response) {
                                if (response.key === "SUCCESS") {
                                    AuthenticationService.register(vm.object, function (response) {
                                        if (response.key === "SUCCESS") {
                                            $location.path('login');
                                        }
                                        CommonController.showNotiCondition(response.key, 'Registration success !', response.message);
                                    });
                                } else {
                                    CommonController.showNotiDanger(response.message);
                                }
                            });
                        };
                    }]);