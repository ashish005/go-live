/**
 * Created by wizdev on 10/25/2015.
 */
(function(define, angular){
    "use strict";
    define([window.appName], function (app) {
        app.controller('userController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http)
            {
                $scope.init = function (){
                    var _httpRequest = {method: 'GET', url: 'api/core/users'};
                    $http(_httpRequest)
                        .success(function (data, status, headers, config) {
                            $scope.user = {data : data['data']};
                            /*
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }*/
                        })
                        .error(function (data, status, headers, config) {});
                };
            }
        ]);
    });
})(window.define, window.angular);