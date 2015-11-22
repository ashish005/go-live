/**
 * Created by wizdev on 11/21/2015.
 */
(function(define, angular){
    "use strict";
    angular
        .module(window['name'])
        .controller('productController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http', 'popupService',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http, popupService)
            {
                var shopAllBase = '';
                $scope.init = function (){

                };

                $(document).on('click', '.btn.btn-xs.btn-outline.btn-primary', function(e){
                    e.stopPropagation();
                    popupService.showProductPopup('show').then(function(){}, function(){});
                });
            }
        ])
})(window.define, window.angular);