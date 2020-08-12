'use strict';

angular.module('myApp')
    .factory('CommonController', ['$rootScope', 'Constants', function ($rootScope, Constants) {
        var common = {};

        common.showNotiDanger = function (message) {
            $(document).Toasts('create', {
                class: 'bg-danger',
                title: message,
                autohide: true,
                delay: 3500
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

        $rootScope.publicKeyCaptcha = Constants.GCAPTCHA.SITE_KEY;

        common.getLongDateFromString = function (string) {
            var arrStr = string.split('/');
            var newStr = arrStr[1] + '/' + arrStr[0] + '/' + arrStr[2];
            return new Date(newStr).getTime();
        };

        $rootScope.$watch('dataLoading', function () {
            var wrapper = $('div.wrapper');
            if ($rootScope.dataLoading == true) {
                var div = $('#loadingIcon');
                $(div).removeClass('fade');

                $(wrapper).css({"opacity": "0.5"});
            } else {
                $(wrapper).removeAttr("style");
            }
        });

        return common;
    }
    ]);
