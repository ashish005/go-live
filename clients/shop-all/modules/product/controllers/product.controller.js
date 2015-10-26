/**
 * Created by wizdev on 10/25/2015.
 */
(function(define, angular){
    "use strict";
    define([window['name']], function (app) {
        app.controller('productController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http)
            {
                $scope.init = function (){
                };
            }
        ]);
    });
})(window.define, window.angular);