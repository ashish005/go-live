/**
 * Created by wizdev on 10/22/2015.
 */
/**
 * Created by wizdev on 8/25/2015.
 */
(function(window, require){
    "use strict";
    define(['angularAMD'], function (angularAMD) {
        var _appName = "goLive";
        var app = angular.module(_appName, ['ui.bootstrap', 'ngRoute', 'goLive.core']);

        app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/home', angularAMD.route({}))
                .otherwise({redirectTo: '/login'});//Handle all exceptions
        }]);

        app.run(['$rootScope', 'authenticationFactory','appInfo', function ($rootScope, authenticationFactory, appInfo) {
            $rootScope.appInfo = appInfo;
            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {

            });
            $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {
                /*console.log('$routeChangeSuccess');*/
            });
            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {

            });
            $rootScope.$on('$viewContentLoaded', function () {

            });
        }]);

        app.config(function( $controllerProvider, $provide, $compileProvider ) {
            // Let's keep the older references.
            app._controller = app.controller;
            app._service = app.service;
            app._factory = app.factory;
            app._value = app.value;
            app._directive = app.directive;

            // Provider-based controller.
            app.controller = function( name, constructor ) {
                $controllerProvider.register( name, constructor );
                return(this);
            };

            // Provider-based service.
            app.service = function( name, constructor ) {
                $provide.service( name, constructor );
                return(this);
            };

            // Provider-based factory.
            app.factory = function( name, factory ) {
                $provide.factory( name, factory );
                return(this);
            };

            // Provider-based value.
            app.value = function( name, value ) {
                $provide.value( name, value );
                return(this);
            };
            // Provider-based directive.
            app.directive = function( name, factory ) {
                $compileProvider.directive( name, factory );
                return(this);
            };
        });

        angular.element(document).ready(function () {
            var initInjector = angular.injector(["ng"]);
            var $http = initInjector.get("$http");
            $http({method: 'GET', url: 'api/core'}).then(function (resp)
            {
                app.constant('appInfo', resp.data[0]);
                $('<div id="wrapper" class="height100"><div go-live-header></div><div ng-view></div></div>').appendTo('body');
                return angular.bootstrap($('body'), [_appName]);
            }, function (error) {
                throw new Error('Config file has error : ' + error);
            });
        });
        return app;
    });
})(window, require);