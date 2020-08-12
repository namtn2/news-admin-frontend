'use strict';

angular.module('Category')
        .controller('CategoryController', ['$scope', '$location', 'CategoryService', 'DataCategory', 'Modals', 'CommonController',
            function ($scope, $location, CategoryService, DataCategory, Modals, CommonController) {

                var vm = $scope;

                vm.categories = [];
                vm.objectSearch = {
                    name: "",
                    active: "2"
                            // currentPage: 1,
                            // maxSize: 10
                };
                // vm.pagination = {
                //     currentPage: 1,
                //     maxSize: 10,
                //     length: 10
                // };

                vm.doSearch = function () {
                    var object = angular.copy(vm.objectSearch);
                    if (object.active === "2") {
                        object.active = null;
                    }
                    CategoryService.search(object, function (response) {
                        if (response.key === "SUCCESS") {
                            if (response.lst) {
                                var lst = response.lst;
                                for (var i = 0; i < lst.length; i++) {
                                    lst[i].active = lst[i].active === 1 ? 'Yes' : 'No';
                                }
                            }
                            vm.categories = lst;
                        }
                    });
                };

                vm.doSearch();

                vm.doDelete = function (id) {
                    Modals.deleteConfirm(function () {
                        CategoryService.delete(id, function (response) {
                            if (response.key === "SUCCESS") {
                                vm.doSearch();
                            }
                            CommonController.showNotiCondition(response.key, 'Delete success !', response.message);
                        });
                    });
                };

                vm.doEdit = function (id) {
                    DataCategory.setCategory({
                        id: id
                    });
                    $location.path('/modal-category');
                };

                vm.doAdd = function () {
                    $location.path('/modal-category');
                };
            }
        ]);

