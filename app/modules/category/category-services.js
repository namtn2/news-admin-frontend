'use strict';

angular.module('Category')

    .factory('CategoryService',
        ['$http', 'CommonController', function ($http, CommonController) {
                var service = {};
                var api = 'http://localhost:8080/category-api/';

                service.list = function (callback) {

                    $http({
                        method: 'get',
                        url: api + 'list'
                        // data: object
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        CommonController.showNotiDanger('Error while calling get data api');
                    });
                };

                service.search = function (objectSearch, callback) {

                    $http({
                        method: 'post',
                        url: api + 'search',
                        data: objectSearch
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        CommonController.showNotiDanger('Error while calling get data api');
                    });
                };

                service.findById = function (id, callback) {

                    $http({
                        method: 'get',
                        url: api + id
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        CommonController.showNotiDanger('Error while calling get data api');
                    });
                };

                service.createOrUpdate = function (category, isCreate, callback) {

                    $http({
                        method: (isCreate === true ? 'post' : 'put'),
                        url: api + (isCreate === true ? 'create' : 'update'),
                        data: category
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        CommonController.showNotiDanger('Error while calling add/update api');
                    });
                };

                service.delete = function (id, callback) {

                    $http({
                        method: 'delete',
                        url: api + 'delete/' + id
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        CommonController.showNotiDanger('Error while calling delete api');
                    });
                };
                return service;
            }])
    .factory('DataCategory', function () {
        var categoryData = {};

        var setCategoryData = function (newObj) {
            categoryData = newObj;
        };

        var getCategoryData = function () {
            return categoryData;
        };

        return {
            getCategory: getCategoryData,
            setCategory: setCategoryData
        };

    });