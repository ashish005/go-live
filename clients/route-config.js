/**
 * Created by wizdev on 10/25/2015.
 */
(function(window, require){
    "use strict";
    define(['angularAMD'], function (angularAMD) {
        var _appName = window['name'];
        var app = angular.module(_appName, ['ui.bootstrap', 'goLive.core']);
        var _baseModulesPath = {
            templateUrl:'enricher/',
            controllerUrl:'enricher/'
        };

        var _viewOptions ={
            home:{
                templateUrl: _baseModulesPath.templateUrl +'home/templates/home.html',
                controllerUrl: _baseModulesPath.controllerUrl +'home/controllers/home.controller'
            }
        };
        app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            //$locationProvider.html5Mode(true);
            $routeProvider
                .when('/', angularAMD.route(_viewOptions.home))
                .otherwise({redirectTo: '/'});
        }]);

        app.run(['$rootScope', 'appInfo', function ($rootScope, appInfo) {
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

        angular.element(document).ready(function () {
            var initInjector = angular.injector(["ng"]);
            var $http = initInjector.get("$http");
            $http({method: 'GET', url: 'api/core'}).then(function (resp)
            {
                app.constant('appInfo', resp.data[0]);
                angularAMD.bootstrap(app);
            }, function (error) {
                throw new Error('Config file has error : ' + error);
            });
        });

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
        return app;
    });
})(window, require);