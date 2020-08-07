'use strict';

angular.module('Register')

    .controller('RegisterController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'Constants', 'vcRecaptchaService', '$timeout',
            function ($scope, $rootScope, $location, AuthenticationService, Constants, vcRecaptchaService, $timeout) {

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
                        vm.showNotiDanger('Password must be matching !');
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
                        console.log(googleUser.getAuthResponse());
                        AuthenticationService.registerGoogle(googleUser.getAuthResponse().id_token, function (response) {
                            if (response.key === "SUCCESS") {
                                if (response.object.id == null) {
                                    vm.object.name = response.object.name;
                                    vm.object.email = response.object.email;
                                } else {
                                    vm.showNotiDanger('You already sign up with this email. Please sign up with another email or sign in with this email !');
                                }
                            } else {
                                vm.showNotiDanger('Error occur while getting your information from Google !');
                            }
                        });
                    }, function (error) {
                        vm.showNotiDanger(error);
                    });
                };

                // vm.registerGoogle = function () {
                //     gapi.auth.authorize({
                //         client_id: Constants.GLOGIN.CLIENT_ID,
                //         scope: Constants.GLOGIN.SCOPE_GOOGLE,
                //         response_type: 'id_token permission code'
                //     }, function (authResult) {
                //         AuthenticationService.registerGoogle(authResult.id_token, function (response) {
                //             if (response.key === "SUCCESS") {
                //                 if (response.object.id == null) {
                //                     vm.object.name = response.object.name;
                //                     vm.object.email = response.object.email;
                //                 } else {
                //                     vm.showNotiDanger('You already sign up with this email. Please sign up with another email or sign in with this email !');
                //                 }
                //             } else {
                //                 vm.showNotiDanger('Error occur while getting your information from Google !');
                //             }
                //         });
                //     });
                // };

                vm.doRegister = function () {
                    var b = vm.matchPassword();
                    if (b == false) {
                        return;
                    }
                    if (vcRecaptchaService.getResponse() === "") {
                        vm.showNotiDanger("Please resolve the captcha and submit!");
                        return;
                    }
                    AuthenticationService.validateCaptcha(vcRecaptchaService.getResponse(), function (response) {
                        if (response.key === "SUCCESS") {
                            AuthenticationService.register(vm.object, function (response) {
                                if (response.key === "SUCCESS") {
                                    $location.path('login');
                                }
                                vm.showNotiCondition(response.key, 'Registration success !', response.message);
                            });
                        } else {
                            vm.showNotiDanger(response.message);
                        }
                    });
                };
            }]);