'use strict';

angular.module('News')
        .controller('NewsController', ['$scope', '$location', 'NewsService', 'DataNews', 'CategoryService', '$timeout', 'Modals', 'CommonController',
            function ($scope, $location, NewsService, DataNews, CategoryService, $timeout, Modals, CommonController) {

                var vm = $scope;

                vm.categories = [];
                vm.news = [];
                vm.objectSearch = {
                    name: "",
                    active: "",
                    categoryId: ""
                            // currentPage: 1,
                            // maxSize: 10
                };
                // vm.pagination = {
                //     currentPage: 1,
                //     maxSize: 10,
                //     length: 10
                // };

                CategoryService.search({active: 1}, function (response) {
                    if (response.key === "SUCCESS") {
                        vm.categories = response.lst;
                    }
                });

                vm.doSearch = function () {
                    var object = angular.copy(vm.objectSearch);
                    $timeout(function () {
                        //timeout for waiting categories is queried
                        NewsService.search(object, function (response) {
                            if (response.key === "SUCCESS") {
                                if (response.lst) {
                                    var lst = response.lst;
                                    for (var i = 0; i < lst.length; i++) {
                                        lst[i].active = lst[i].active === 1 ? 'Yes' : 'No';
                                        if (vm.categories) {
                                            for (var j = 0; j < vm.categories.length; j++) {
                                                if (lst[i].categoryId == vm.categories[j].id) {
                                                    lst[i].categoryName = vm.categories[j].name;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                vm.news = lst;
                            }
                        });
                    }, 100);
                };

                vm.doSearch();

                vm.doDelete = function (id) {
                    Modals.deleteConfirm(function () {
                        NewsService.delete(id, function (response) {
                            if (response.key === "SUCCESS") {
                                vm.doSearch();
                            }
                            CommonController.showNotiCondition(response.key, 'Delete success !', response.message);
                        });
                    });
                };

                vm.doEdit = function (idEdit) {
                    DataNews.setNews({
                        id: idEdit
                    });
                    DataNews.setLstCate(vm.categories);
                    $location.path('/modal-news');
                };

                vm.doAdd = function () {
                    DataNews.setLstCate(vm.categories);
                    $location.path('/modal-news');
                };
            }]);

