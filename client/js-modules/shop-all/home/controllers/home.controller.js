/**
 * Created by wizdev on 11/21/2015.
 */
(function(define, angular){
    "use strict";
    angular
        .module(window['name'])
        .controller('homeController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http', 'popupService',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http, popupService)
            {
                $scope.init = function (){
                };
            }
        ])
})(window.define, window.angular);