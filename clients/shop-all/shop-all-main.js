/**
 * Created by wizdev on 10/25/2015.
 */
(function(window, require){
    "use strict";
    define(['angularAMD'], function (angularAMD) {
        var _appName = window['name'];
        var app = angular.module(_appName, ['ui.bootstrap', 'goLive.core']);
        var _baseModulesPath = {
            templateUrl:'shop-all/modules/',
            controllerUrl:'modules/'
        };

        var _shopAllRouteConfig = {
            product:{
                templateUrl: _baseModulesPath.templateUrl +'product/templates/product.html',
                controllerUrl: _baseModulesPath.controllerUrl +'product/controllers/product.controller',
                access: {
                    requiredLogin: true
                },
            }
        };

        app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/product', angularAMD.route(_shopAllRouteConfig.product))
                .otherwise({redirectTo: '/product'});//Handle all exceptions
        }]);

        app.run(['$rootScope', 'authenticationFactory','appInfo', 'userInfo', function ($rootScope, authenticationFactory, appInfo, userInfo) {
            $rootScope.appInfo = appInfo;
            $rootScope.userInfo = userInfo;
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
            var authFac = angular.injector(['goLive.core']).get('authenticationFactory');
            authFac.check();

            if(authFac['isLogged']){
                var $http = initInjector.get("$http");
                $http({method: 'GET', url: 'api/core/preferences'}).then(function (resp)
                {
                    app.constant('userInfo',authFac.getInfo());
                    var info = resp.data['data'];
                    info.defaultOption = [
                        {key:'signout', name:'Signout', routeTo:'login'}
                    ];
                    app.constant('appInfo', info);
                    $('<div landing-scrollspy><div go-live-header></div><div ng-view></div></div>').appendTo('body');
                    return angular.bootstrap($('body'), [_appName]);
                }, function (error) {
                    window.location.hash='/login';
                    throw new Error('Config file has error : ' + error);
                });
            }
        });
        return app;
    });
})(window, require);