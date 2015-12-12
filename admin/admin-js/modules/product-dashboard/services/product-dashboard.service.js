/**
 * Created by wizdev on 11/8/2015.
 */
(function(define, angular){
    "use strict";
    define([window['appName']], function (app) {
        app.service('productDashboardService', ['$http', 'config', 'appInfo', '$q',
            function ($http, config, appInfo, $q)
            {
                var _service = {
                    getCategories: function(){
                        var deferred = $q.defer();
                        deferred.resolve({data:appInfo});
                        return deferred.promise;
                    }
                };

                _service.nodes = {
                    add: function (item) {
                        var _httpRequest = {method: 'POST', url: 'api/core/collection/item', params: item};
                        return $http(_httpRequest);
                    },
                    update: function (item) {
                        var _httpRequest = {method: 'PUT', url: 'api/core/collection/item', params: item};
                        return $http(_httpRequest);
                    },
                    delete: function (item) {
                        var _httpRequest = {method: 'DELETE', url: 'api/core/collection/item', params: item};
                        return $http(_httpRequest);
                    }
                }
                return _service;
            }
        ]);
    });
})(window.define, window.angular);