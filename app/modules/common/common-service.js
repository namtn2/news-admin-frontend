'use strict';

angular.module('myApp')

    .factory('CommonService',
        ['$http', function ($http) {
                var service = {};
                var api = 'http://localhost:8080/config/';

                service.getByGroup = function (group, callback) {

                    $http({
                        method: 'get',
                        url: api + 'group/' + group
                    }).then(function (response) {
                        callback(response.data);
                    }, function (error) {

                    });
                };

                return service;
            }])
     ;