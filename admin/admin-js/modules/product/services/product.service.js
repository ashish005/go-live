/**
 * Created by wizdev on 11/27/2015.
 */
(function(define, angular){
    "use strict";
    define([window['appName']], function (app) {
        app.service('productService', ['$q', '$http', 'config', 'appInfo', 'utility',
            function ($q, $http, config, appInfo, utility)
            {
                var _service = {
                    getProducts: function(key){
                        var deferred = $q.defer();
                        var _info = utility.filter.hierarchicalDataByKeyValue(appInfo, 'id', parseInt(key));
                        deferred.resolve({data:[_info]});
                        return deferred.promise;
                    }
                };
                return _service;
            }
        ]);
    });
})(window.define, window.angular);