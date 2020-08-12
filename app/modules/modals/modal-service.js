'use strict';

angular.module('Modals')
    .factory('Modals', ['$uibModal', '$timeout', function ($uibModal, $timeout) {
        var popup = {};

        popup.deleteConfirm = function (fn) {
            $uibModal.open({
                templateUrl: 'modules/modals/modal.html',
                backdrop: 'static',
                size: 'dialog',
                controller: function ($scope, $uibModalInstance) {
                    $scope.modal = $uibModalInstance;
                    $scope.message = 'You are going to delete this record. Are you sure ?';
                    $scope.title = "Delete confirm";
                    $scope.ok = function () {
                        if (fn) {
                            fn();
                            $uibModalInstance.close();
                        }
                    };

                    $timeout(function () {
                        var div = $('div.modal');
                        $(div).removeClass('fade');
                    }, 100);
                }
            });
        };

        return popup;
    }])
;

