/**
 * Created by wizdev on 11/21/2015.
 */

(function (angularAMD) {
    var appName = 'goLive';
    var app = angular.module(appName, [
        'goLive.core',                  //Core
        'goLive.chat',                  //Chat
        'ngRoute'                     // Routing
    ])

    var _path = {
        baseTemplateUrl:'js-modules/shop-all/'
    };

    var _viewOptions ={
        category:{
            templateUrl: _path['baseTemplateUrl'] +'category/templates/category.html',
            controllerUrl: _path['baseTemplateUrl'] +'category/controllers/category.controller'
        },
        product:{
            templateUrl: _path['baseTemplateUrl'] +'products/templates/products.html',
            controllerUrl: _path['baseTemplateUrl'] +'products/controllers/products.controller'
        },
        home:{
            templateUrl: _path['baseTemplateUrl'] +'home/templates/home.html',
            controllerUrl: _path['baseTemplateUrl'] +'home/controllers/home.controller'
        }
    };

    var popupViewOptions = {
        product:{
            show: _path['baseTemplateUrl'] +'products/templates/pop-ups/show-product.html'
        }
    };

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/category', angularAMD.route(_viewOptions.category))
            .when('/product', angularAMD.route(_viewOptions.product))
            .when('/', angularAMD.route(_viewOptions.home))
            .otherwise({redirectTo: '/'});
    }

    function angularHelper( $controllerProvider, $provide, $compileProvider ) {
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
    }

    app
        .config(angularHelper)
        .config(config)
        .constant('popupView', popupViewOptions)
        .run(['$rootScope', 'menu',function($rootScope, menu) {

            $rootScope.productMenu = menu;
            $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {});
            $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {});
            $rootScope.$on('$viewContentLoaded', function () {});
        }]);

    angular.element(document).ready(function () {
        var initInjector = angular.injector(["ng"]);
        var $http = initInjector.get("$http");
        $http({method: 'GET', url: 'api/products'}).then(function (resp)
        {
            app.constant('menu', resp['data']);
            $('<div class="gray-bg"><div go-live-header></div><div ng-view></div><div chat></div></div>').appendTo('body');
            return angular.bootstrap($('body'), [appName]);
        }, function (error) {
            $rootScope.productMenu = [];
            throw new Error('Config file has error : ' + error);
        });
    });


})(require('angularAMD'));