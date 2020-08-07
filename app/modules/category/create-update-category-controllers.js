'use strict';

angular.module('CreateUpdateCategory')
    .controller('CreateUpdateCategoryController', ['$scope', '$location', 'CategoryService', 'DataCategory', function ($scope, $location, CategoryService, DataCategory) {

        var vm = $scope;
        vm.title = '';
        vm.isCreate = true;
        vm.objectModal = {
            name: '',
            active: "1"
        };

        var categoryData = DataCategory.getCategory();

        if (categoryData.id != null) {
            CategoryService.findById(categoryData.id, function (response) {
                if (response.key === "SUCCESS") {
                    vm.objectModal = response.object;
                    vm.objectModal.active = vm.objectModal.active + "";
                    vm.title = 'Update category';
                    vm.isCreate = false;
                }
            });
        } else {
            vm.title = 'Add new category';
            vm.isCreate = true;
        }

        vm.doCancel = function () {
            $location.path('/category');
            DataCategory.setCategory({});
        };

        vm.doSave = function () {
            CategoryService.createOrUpdate(vm.objectModal, vm.isCreate, function (response) {
                if (response.key === "SUCCESS") {
                    $location.path('/category');
                    DataCategory.setCategory({});
                }
                vm.showNotiCondition(response.key, 'Update success !', response.message);
            });
        };
    }]);

