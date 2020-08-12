'use strict';

angular.module('Log').controller('LogDetailController', ['$scope', 'dataLog', '$uibModalInstance',
    function ($scope, dataLog, $uibModalInstance) {

        $scope.log = dataLog;
        $scope.log.content = JSON.stringify($scope.log.content);

        $scope.doClose = function () {
            $uibModalInstance.close();
        };
    }]);