'use strict';

angular.module('Log')

        .factory('LogService',
                ['$http', 'CommonController', function ($http, CommonController) {
                        var service = {};
                        var api = 'http://localhost:8080/log/';

                        service.list = function (object, callback) {
                            $http({
                                method: 'post',
                                url: api + 'search?rowStart=' + object.rowStart + '&maxRow=' + object.maxRow,
                                data: object.data
                            }).then(function (response) {
                                callback(response.data);
                            }, function (error) {
//                                CommonController.showNotiDanger('Error while calling get data api');
                            });
                        };
                        
                        return service;
                    }])
//        .factory('DataNews', function () {
//            var newsData = {};
//            var lstCate = {};
//
//            var setNewsData = function (newObj) {
//                newsData = newObj;
//            };
//            var setLstCate = function (lst) {
//                lstCate = lst;
//            };
//            var getNewsData = function () {
//                return newsData;
//            };
//            var getLstCate = function () {
//                return lstCate;
//            };
//            return {
//                getNews: getNewsData,
//                setNews: setNewsData,
//                getLstCate: getLstCate,
//                setLstCate: setLstCate
//            };
//        })
        ;