/**
 * Created by wizdev on 11/25/2015.
 */
(function(define, angular){
    "use strict";
    define([window.appName, 'product-dashboard-service'], function (app) {
        app.controller('productDashboardController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$location', 'productDashboardService', 'popupService', 'popupView', 'treeOperations',
            function ($scope, $rootScope, $q, $compile, $routeParams, $location, productDashboardService, popupService, popupView, treeOperations)
            {
                $scope.init = function (){
                    productDashboardService.getCategories().then(function (resp)
                    {
                        $scope.productCategory = resp['data'];
                    }, function (error) {});

                    $rootScope.showInfo = function(info){
                        $location.path('/product/'+ this.node['id']);
                    };

                    $scope.show = function(info){
                        var _model = {
                            model : info['node'],
                            operation : treeOperations
                        };
                        popupService['showPopup'](popupView['product-dashboard']['tree']['templateUrl'], _model).then(function(resp){}, function(err){});
                    };
                };
            }
        ]);
    });
})(window.define, window.angular);