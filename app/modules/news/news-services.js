'use strict';

angular.module('News')

    .factory('NewsService',
        ['$http', function ($http, $scope) {
                var service = {};
                var api = 'http://localhost:8080/news-api/';
                var vm = $scope;

                service.list = function (callback) {

                    $http({
                        method: 'get',
                        url: api + 'list'
                        // data: object
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        vm.showNotiDanger('Error while calling get data api');
                    });
                };

                service.search = function (objectSearch, callback) {

                    $http({
                        method: 'post',
                        url: api + 'search',
                        data: objectSearch,
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        vm.showNotiDanger('Error while calling get data api');
                    });
                };

                service.findById = function (id, callback) {

                    $http({
                        method: 'get',
                        url: api + id
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        vm.showNotiDanger('Error while calling get data api');
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
                        vm.showNotiDanger('Error while calling add/update api');
                    });
                };

                service.delete = function (id, callback) {

                    $http({
                        method: 'delete',
                        url: api + 'delete/' + id
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {
                        vm.showNotiDanger('Error while calling delete api');
                    });
                };
                return service;
            }])
    .factory('DataNews', function () {
        var newsData = {};
        var lstCate = {};

        var setNewsData = function (newObj) {
            newsData = newObj;
        };
        var setLstCate = function(lst){
            lstCate = lst;
        };
        var getNewsData = function () {
            return newsData;
        };
        var getLstCate = function () {
            return lstCate;
        };
        return {
            getNews: getNewsData,
            setNews: setNewsData,
            getLstCate: getLstCate,
            setLstCate: setLstCate
        };

    });