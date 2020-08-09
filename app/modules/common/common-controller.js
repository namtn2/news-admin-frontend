'use strict';

angular.module('myApp')
    .factory('CommonController', ['$rootScope', '$cookieStore', '$location', 'Constants',
        function ($rootScope, $cookieStore, $location, Constants) {
            var common = {};

            common.showNotiDanger = function (message) {
                $(document).Toasts('create', {
                    class: 'bg-danger',
                    title: message,
                    autohide: true,
                    delay: 3500
                });
            };

            common.showNotiDangerNotHide = function (message) {
                $(document).Toasts('create', {
                    class: 'bg-danger',
                    title: message
                });
            };

            common.showNotiCondition = function (condition, messageSuccess, messageFail) {
                $(document).Toasts('create', {
                    class: condition === "SUCCESS" ? 'bg-success' : 'bg-danger',
                    title: condition === "SUCCESS" ? messageSuccess : messageFail,
                    autohide: true,
                    delay: 3500
                });
            };

            $rootScope.doLogout = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $location.path('login');
            };

            $rootScope.publicKeyCaptcha = Constants.GCAPTCHA.SITE_KEY;

            return common;
        }]);
