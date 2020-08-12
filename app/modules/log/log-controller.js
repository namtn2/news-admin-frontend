'use strict';

angular.module('Log')
    .controller('LogController', ['$scope', '$location', 'LogService', '$timeout', 'Modals', 'CommonController', 'CommonService', 'Constants',
        function ($scope, $location, LogService, $timeout, Modals, CommonController, CommonService, Constants) {

            var vm = $scope;

            vm.logs = [];
            vm.configList = [];
            vm.objectSearch = {
                email: "",
                status: "",
                logType: "",
                message: ""
            };
            vm.pagination = {
                currentPage: 0,
                itemsPerPage: '5'
            };

            CommonService.getByGroup(Constants.CONFIG.USER_ACTION, function (response) {
                vm.configList = response;
            });

            vm.doSearch = function () {
                $timeout(function () {
                    var dateRange = $('#reservationtime')[0].value;
                    if (dateRange != 'undefined' && dateRange != null && dateRange != '') {
                        var arrDate = dateRange.split(' - ');
                        vm.objectSearch.createTimeFrom = CommonController.getLongDateFromString(arrDate[0]);
                        vm.objectSearch.createTimeTo = CommonController.getLongDateFromString(arrDate[1]);
                    }

                    var data = angular.copy(vm.objectSearch);

                    data.logType = data.logType == "" ? null : data.logType;
                    var object = {
                        data: data,
                        rowStart: vm.pagination.currentPage,
                        maxRow: vm.pagination.itemsPerPage
                    };
                    LogService.list(object, function (response) {
                        vm.logs = [];
                        if (response.content) {
                            vm.pagination.totalItems = response.totalElements;
                            vm.pagination.numOfPage = response.totalPages;

                            for (var i = 0; i < response.content.length; i++) {
                                var data = response.content[i];
                                data.createTime = new Date(data.createTime);
                                if (vm.configList) {
                                    for (var j = 0; j < vm.configList.length; j++) {
                                        var config = vm.configList[j];
                                        if (config.key == data.logType) {
                                            data.logType = config.value;
                                            break;
                                        }
                                    }
                                }
                            }
                            vm.logs = response.content;
                        }
                    });
                }, 100);
            };

//            vm.resetConfig = function () {
//                vm.logs = [];
//                vm.pagination.totalItems = 1;
//                vm.pagination.currentPage = 0;
//                vm.pagination.numOfPage = 1;
//            };

            vm.doSearch();

            vm.pageChange = function (currentPage) {
                vm.pagination.currentPage = currentPage;
                vm.doSearch();
            };

            vm.itemPerPageChange = function () {
                vm.doSearch();
            };

            vm.viewDetail = function (object) {
                Modals.openPopup('modules/log/log-detail.html', 'LogDetailController', object);
            };

            $('#reservationtime').daterangepicker({
                timePicker: true,
                timePickerIncrement: 30,
                locale: {
                    format: 'DD/MM/YYYY hh:mm:ss A'
                }
            });

        }]);

