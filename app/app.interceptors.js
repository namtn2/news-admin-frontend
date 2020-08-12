'use strict';

angular.module('myApp')
        .service('Interceptor', ['$q', '$rootScope', '$localStorage', '$location', '$injector',
            function ($q, $rootScope, $localStorage, $location, $injector) {
                var service = this;
                var inFlightRequest = null;
                service.request = function (config) {
                    return config;
                };

                service.response = function (response) {
                    return response || $q.when(response);
                };

                service.responseError = function (rejection) {
                    if (rejection.status == 401) {

                        var $http = $injector.get('$http');
                        var deferred = $q.defer();

                        if (!inFlightRequest) {
                            var data = {
                                refreshToken: $localStorage.currentUser.refreshToken,
                                email: $localStorage.currentUser.userName
                            };
                            inFlightRequest = $injector.get('AuthenticationService').refreshToken(data);
                        }

                        inFlightRequest.then(function (response) {
                            inFlightRequest = null;
                            $http(response.config).then(deferred.resolve, deferred.reject);
                        }, function (err) {
                            
                        });
                        return deferred.promise;

                    } else if (rejection.status == 403 || rejection.status == 404) {
                        $location.path('403');
                    }
                    return rejection || $q.reject(rejection);
                };

                return service;
            }]);