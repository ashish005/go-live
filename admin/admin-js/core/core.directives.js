/**
 * Created by wizdev on 7/12/2015.
 */
(function(define, angular){
    "use strict";
    var core = angular.module('goLive.core', ['ngRoute']);
    define(['angularAMD'], function (angularAMD) {
        var _viewOptions = {
            login: {
                templateUrl: 'admin-js/core/templates/login.html'
            },
            register: {
                templateUrl: 'admin-js/core/templates/register.html'
            },
            forgot_password: {
                templateUrl: 'admin-js/core/templates/forgot_password.html'
            },
            headerTemplateUrl: 'admin-js/core/templates/header.html'
        };

        core.factory('authenticationFactory', ["$window", function ($window) {
            var auth = {
                isLogged: false,
                name: '',
                user: '',
                roel: '',
                isAuthenticated  : false,
                check: function () {
                    //if ($window.sessionStorage.token && $window.sessionStorage.user) //Remove window session storage code
                    if ($window.sessionStorage.user)
                    {
                        this.isLogged = true;
                    } else {
                        this.isLogged = false;
                        delete this.user;
                    }
                },
                setInfo: function (user) {
                    this.name = user.name;
                    this.user = user.email;
                    this.role = user.role;
                    this.token = user.token;

                    $window.sessionStorage.token = this.token;
                    $window.sessionStorage.name = this.name;
                    $window.sessionStorage.user = this.user;
                    $window.sessionStorage.role = this.role;
                },
                setAuthInfoFromStorage: function () {
                    this.name = $window.sessionStorage.name ;
                    this.user = $window.sessionStorage.user;
                    this.role = $window.sessionStorage.role;
                    this.token = $window.sessionStorage.token;
                },
                clearInfo: function () {
                    this.isLogged = false;
                    this.isAuthenticated = false,

                    delete this.name;
                    delete this.user;
                    delete this.role;
                    delete this.token;

                    //Remove window session storage code
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.name;
                    delete $window.sessionStorage.user;
                    delete $window.sessionStorage.role;
                },
                getAuthToken: function () {
                    return 'Bearer ' + $window.sessionStorage.token;
                }
            }
            return auth;
        }]);
        core.factory('tokenInterceptor', ['$q', '$location', 'authenticationFactory',function ($q, $location, authenticationFactory) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = authenticationFactory.getAuthToken();
                    return config;
                },
                requestError: function (rejection) {
                    return $q.reject(rejection);
                },
                /* Set Authentication.isAuthenticated to true if 200 received */
                response: function (response) {
                    if (response != null && response.status == 200 && authenticationFactory.getAuthToken() && !authenticationFactory.isAuthenticated) {
                        authenticationFactory.isAuthenticated = true;
                    }
                    return response || $q.when(response);
                },
                /* Revoke client authentication if 401 is received */
                responseError: function (rejection) {
                    if (rejection != null && rejection.status === 401 && (authenticationFactory.getAuthToken() || authenticationFactory.isAuthenticated)) {
                        //delete $window.sessionStorage.token;//Remove window session storage code
                        authenticationFactory.clearInfo();
                        authenticationFactory.isAuthenticated = false;
                        $location.path("/login");
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
        core.config(function ($httpProvider) {
            //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.headers.common["Accept"] = "*/*";
            $httpProvider.interceptors.push('tokenInterceptor');
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.timeout = 600000;
        });
        core.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/login', _viewOptions.login)
                .when('/register', _viewOptions.register)
                .when('/forgot_password', _viewOptions.forgot_password)
        }]);

        core.directive('goLiveHeader', ['$timeout', function ($timeout) {
            return {
                restrict: 'AE',
                templateUrl:_viewOptions.headerTemplateUrl
            };
        }]);
    });
})(window.define, window.angular);