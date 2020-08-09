'use strict';

angular.module('News')
    .controller('CreateUpdateNewsController', ['$scope', '$location', 'NewsService', 'DataNews', function ($scope, $location, NewsService, DataNews) {

        var vm = $scope;
        vm.title = '';
        vm.isCreate = true;
        vm.objectModal = {
            title: '',
            active: "1",
            content: '',
            categoryId: "0"
        };

        vm.categories = DataNews.getLstCate();
        var newsData = DataNews.getNews();

        if (newsData.id != null) {
            NewsService.findById(newsData.id, function (response) {
                if (response.key === "SUCCESS") {
                    vm.objectModal = response.object;
                    vm.objectModal.active = vm.objectModal.active + "";
                    vm.objectModal.categoryId = vm.objectModal.categoryId + "";
                    vm.title = 'Update news';
                    vm.isCreate = false;
                }
            });
        } else {
            vm.title = 'Add new news';
            vm.isCreate = true;
        }

        vm.doCancel = function () {
            DataNews.setNews({});
            DataNews.setLstCate([]);
            $location.path('/news');
        };

        vm.doSave = function () {
            NewsService.createOrUpdate(vm.objectModal, vm.isCreate, function (response) {
                if (response.key === "SUCCESS") {
                    $location.path('/news');
                    DataNews.setNews({});
                    DataNews.setLstCate([]);
                }
                vm.showNotiCondition(response.key, 'Update success !', response.message);
            });
        };
    }]);

