/**
 * Created by wizdev on 10/25/2015.
 */
(function(define, angular){
    "use strict";
    define([window['name'], 'popup-service'], function (app) {
        app.controller('productController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http', 'popupService',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http, popupService)
            {
                $scope.init = function (){
                    $http({method: 'GET', url: 'api/products'}).then(function (resp) {
                        $rootScope.productMenu = resp['data'];
                    }, function (err) {
                        $rootScope.productMenu = [];
                    });
                };

                $(document).on('click', '.btn.btn-xs.btn-outline.btn-primary', function(e){
                    e.stopPropagation();
                    popupService.showProductPopup('show').then(function(){}, function(){});
                });
            }
        ]);
    });
})(window.define, window.angular);