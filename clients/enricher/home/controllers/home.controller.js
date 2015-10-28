/**
 * Created by wizdev on 10/28/2015.
 */
(function(define, angular){
    "use strict";
    var app = window['name'];
    define([app, 'full-width-slider'], function (app) {
        app.controller('homeController', ['$scope', '$rootScope',
            function ($scope, $rootScope)
            {
                $scope.init = function () {};
            }
        ]);
    });
})(window.define, window.angular);