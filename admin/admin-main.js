/**
 * Created by wizdev on 10/22/2015.
 */
/**
 * Created by wizdev on 8/25/2015.
 */
(function(window, require){
    "use strict";
    define(['angularAMD'], function (angularAMD) {
        window.appName  = "goLive";
        var _appName = window.appName;

        var app = angular.module(_appName, ['ui.bootstrap', 'ngRoute', 'goLive.core', 'ui.tree']);
        var _baseModulesPath = {
            templateUrl:'admin-js/modules/',
            controllerUrl:'admin-js/modules/'
        };

        var _adminRouteConfig = {
            dashboard:{
                templateUrl: _baseModulesPath.templateUrl +'dashboard/templates/dashboard.html',
                controllerUrl: _baseModulesPath.controllerUrl +'dashboard/controllers/dashboard.controller',
                access: {
                    requiredLogin: true
                },
            },
            users:{
                templateUrl: _baseModulesPath.templateUrl +'users/templates/users.html',
                controllerUrl: _baseModulesPath.controllerUrl +'users/controllers/users.controller',
                access: {
                    requiredLogin: true
                },
            }
        };


        var popupView = {
            dashboard:{
                view:{ templateUrl:_baseModulesPath['templateUrl'] + 'dashboard/templates/popups/popup-view.html' },
                delete:{ templateUrl:_baseModulesPath['templateUrl'] + 'dashboard/templates/popups/popup-delete.html' },
                edit:{ templateUrl:_baseModulesPath['templateUrl'] + 'dashboard/templates/popups/popup-edit.html' },
                tree:{ templateUrl:_baseModulesPath['templateUrl'] + 'dashboard/templates/popups/popup-tree.html' }
            }
        };

        function routeConfig($routeProvider, $locationProvider) {
            $routeProvider
                .when('/dashboard', angularAMD.route(_adminRouteConfig.dashboard))
                .when('/users', angularAMD.route(_adminRouteConfig.users))
                .otherwise({redirectTo: '/login'});//Handle all exceptions
        };

        function run($rootScope, authenticationFactory) {
            /*$rootScope.appInfo = appInfo;*/
            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {});
            $rootScope.$on('$viewContentLoaded', function () {});
        };

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

        app
            .constant('popupView', popupView)
            .config(['$routeProvider', '$locationProvider', routeConfig])
            .run(['$rootScope', 'authenticationFactory', run])

        angular.element(document).ready(function () {
            var initInjector = angular.injector(["ng"]);
            var $http = initInjector.get("$http");
            /*$http({method: 'GET', url: 'api/core'}).then(function (resp)
            {
                app.constant('appInfo', resp.data[0]);
                $('<div landing-scrollspy><div go-live-header></div><div ng-view></div></div>').appendTo('body');
                return angular.bootstrap($('body'), [_appName]);
            }, function (error) {
                throw new Error('Config file has error : ' + error);
            });*/
            $('<div landing-scrollspy><div go-live-header></div><div ng-view></div></div>').appendTo('body');
            return angular.bootstrap($('body'), [_appName]);
        });
        return app;
    });
})(window, require);