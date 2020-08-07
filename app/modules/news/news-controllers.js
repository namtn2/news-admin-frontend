'use strict';

angular.module('News')
    .controller('NewsController', ['$scope', '$location', '$rootScope', 'NewsService', 'DataNews', 'CategoryService', '$timeout',
        function ($scope, $location, $rootScope, NewsService, DataNews, CategoryService, $timeout) {

            var vm = $scope;

            vm.categories = [];
            vm.news = [];
            vm.objectSearch = {
                name: "",
                active: "2",
                categoryId: "null"
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
                if (object.active === "2") {
                    object.active = null;
                }
                if (object.categoryId == "null") {
                    object.categoryId = null;
                }
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
                // console.log(event);
                // console.log(id);
                // var confirm = $mdDialog.confirm()
                //     .title('Are you sure to delete the record?')
                //     .textContent('Record will be deleted permanently.')
                //     .ariaLabel('')
                //     .targetEvent(event)
                //     .ok('Yes')
                //     .cancel('No');
                // $mdDialog.show(confirm).then(function() {
                //                 //
                //                 // }, function() {
                //                 //     $scope.status = 'You decided to keep your record.';
                //                 // });
                NewsService.delete(id, function (response) {
                    if (response.key === "SUCCESS") {
                        vm.doSearch();
                    }
                    vm.showNotiCondition(response.key, 'Delete success !', response.message);
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

