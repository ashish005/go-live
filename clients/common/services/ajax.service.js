/**
 * Created by wizdev on 9/24/2015.
 */
(function () {
    "use strict";
    define(['shop-all'], function (app) {
        app.factory('ajaxService', ['$q', '$http',
            function ($q, $http) {
                var _fac = {};
                //loadingData.start();
                _fac.http = function (request) {
                    request.cache = false;
                    var deferred = $q.defer();
                    $http(request).success(function (response) {
                        //loadingData.stop(); //hide loader
                        deferred.resolve(response);
                    }).error(function (xhr, status, error, exception) {
                        //loadingData.stop(); //hide loader
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                }
                _fac.httpParrallelGet = function (reqApis) {
                    var deferred = $q.defer();
                    //loadingData.start();
                    var arr = [];
                    angular.forEach(reqApis.requests, function (req, index) {
                        arr.push($http(req));
                    });

                    $q.all(arr).then(function (respArray) {
                        //loadingData.stop(); //hide loader
                        deferred.resolve(respArray);
                    }, function (xhr) {
                        //loadingData.stop(); //hide loader
                        deferred.reject(xhr);
                    });
                    return deferred.promise;
                }
                return _fac;
            }]);
    });
})();