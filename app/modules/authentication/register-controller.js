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
                                vm.dataLoading = true;
                                var div = $('div.modal.fade');
                                $(div).removeClass('fade');

                                var registerPage = $('div.register-box');
                                $(registerPage).css({"opacity": "0.5"});

                                AuthenticationService.registerGoogle(googleUser.getAuthResponse().id_token, function (response) {
                                    if (response.key === "SUCCESS") {
                                        vm.object.name = response.object.name;
                                        vm.object.email = response.object.email;
                                    } else {
                                        CommonController.showNotiDanger(response.message);
                                    }
                                    vm.dataLoading = false;
                                    $(registerPage).removeAttr("style");
                                });
                            }, function (error) {
                                CommonController.showNotiDanger(error);
                                vm.dataLoading = false;
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
                                vm.dataLoading = true;
                                var registerPage = $('div.register-box');
                                $(registerPage).css({"opacity": "0.5"});

                                if (response.key === "SUCCESS") {
                                    AuthenticationService.register(vm.object, function (response) {
                                        if (response.key === "SUCCESS") {
                                            $location.path('login');
                                        }
                                        CommonController.showNotiCondition(response.key, 'Registration success !', response.message);
                                        vm.dataLoading = false;
                                    });
                                } else {
                                    CommonController.showNotiDanger(response.message);
                                    vm.dataLoading = false;
                                }
                                $(registerPage).removeAttr("style");
                            });
                        };
                    }]);