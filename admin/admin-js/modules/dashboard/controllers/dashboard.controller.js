/**
 * Created by wizdev on 10/24/2015.
 */
(function(define, angular){
    "use strict";
    define([window.appName], function (app) {
        app.controller('dashboardController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http)
            {
                $scope.init = function (){
                    $scope.form = {};
                    var _httpRequest = {method: 'GET', url: 'api/core/collections'};
                     $http(_httpRequest)
                        .success(function (data, status, headers, config) {
                            $scope.form.collection = data['data'];

                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                     })
                     .error(function (data, status, headers, config) {});

                    $scope.selectAction = function() {
                        var _httpRequest = {method: 'GET', url: 'api/core/collection/data', params:$scope.form['actveOpt']};
                        $http(_httpRequest)
                            .success(function (data, status, headers, config) {
                                $scope.collectionData = data['data'];

                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                            })
                            .error(function (data, status, headers, config) {});
                    };
                };
            }
        ]);
    });
})(window.define, window.angular);