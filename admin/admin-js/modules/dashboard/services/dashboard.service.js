/**
 * Created by wizdev on 11/8/2015.
 */
(function(define, angular){
    "use strict";
    define([window['appName']], function (app) {
        app.service('dashboardService', ['$http',
            function ($http)
            {
                var _service = {
                    getAllCollections: function(){
                        var _httpRequest = {method: 'GET', url: 'api/core/collections'};
                       return $http(_httpRequest);
                    },
                    getActiveCollection: function(collectionName){
                        var _httpRequest = {method: 'GET', url: 'api/core/collection/data', params:collectionName};
                        return $http(_httpRequest);
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