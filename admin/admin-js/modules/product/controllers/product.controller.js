/**
 * Created by wizdev on 11/27/2015.
 */
(function(define, angular){
    "use strict";
    define([window.appName, 'product-service'], function (app) {
        app.controller('productController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$location', 'productService', 'popupService', 'popupView', 'treeOperations',
            function ($scope, $rootScope, $q, $compile, $routeParams, $location, productService, popupService, popupView, treeOperations)
            {
                $scope.init = function (){
                    productService.getProducts($routeParams.key).then(function (resp)
                    {
                        $scope.productCategory = resp['data'];
                    }, function (error) {});
                };
            }
        ])
    });
})(window.define, window.angular);