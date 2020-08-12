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
                        var data = angular.copy(vm.objectSearch);
                        data.logType = data.logType == "" ? null : data.logType;
                        var object = {
                            data: data,
                            rowStart: vm.pagination.currentPage,
                            maxRow: vm.pagination.itemsPerPage
                        };
                        LogService.list(object, function (response) {
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

                vm.doSearch();

                vm.pageChange = function (currentPage) {
                    vm.pagination.currentPage = currentPage;
                    vm.doSearch();
                };

                vm.itemPerPageChange = function () {
                    vm.doSearch();
                };

//                vm.doEdit = function (idEdit) {
//                    DataLog.setLog({
//                        id: idEdit
//                    });
//                    DataLog.setLstCate(vm.categories);
//                    $location.path('/modal-news');
//                };

            }]);

