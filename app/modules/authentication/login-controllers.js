'use strict';

angular.module('Authentication')

    .controller('LoginController',
        ['$scope', '$rootScope', '$location', 'AuthenticationService', 'Constants', 'vcRecaptchaService', '$timeout',
            function ($scope, $rootScope, $location, AuthenticationService, Constants, vcRecaptchaService, $timeout) {
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
                                    vm.showNotiDanger(response.message);
                                }
                            });
                        } else {
                            vm.showNotiDanger(response.message);
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
                                vm.showNotiDanger(response.message);
                            }
                        });
                    }, function (error) {
                        vm.showNotiDanger(error);
                    });
                };

                // vm.loginGoogle = function () {
                // gapi.auth.authorize({
                // client_id: Constants.GLOGIN.CLIENT_ID,
                // scope: Constants.GLOGIN.SCOPE_GOOGLE,
                // response_type: 'id_token',
                //     immediate: false
                // }, function (authResult) {
                //     console.log(authResult);
                // AuthenticationService.loginGoogle(authResult.id_token, function (response) {
                //     if (response.key === "SUCCESS") {
                //         AuthenticationService.SetCredentials(response.object);
                //         $location.path('/');
                //     } else {
                //         vm.showNotiDanger(response.message);
                //     }
                // });
                // });
                // };

                vm.doRegister = function () {
                    $location.path('register');
                };

                vm.changeValue = function () {
                    $rootScope.rememberUserCookies = vm.rememberMe;
                };
            }]);