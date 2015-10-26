/**
 * Created by wizdev on 7/12/2015.
 */
(function(define, angular){
    "use strict";
    var core = angular.module('goLive.core', ['ngRoute']);
    define(['angularAMD'], function (angularAMD) {
        var _viewOptions = {
            login: {
                templateUrl: './core/templates/login.html'
            },
            register: {
                templateUrl: './core/templates/register.html'
            },
            forgot_password: {
                templateUrl: './core/templates/forgot-password.html'
            },
            lockscreen:{
                templateUrl: './core/templates/lockscreen.html'
            },
            400:{
                templateUrl: './core/templates/error/page-not-found.html'
            },
            500:{
                templateUrl: './core/templates/error/internal-server-error.html'
            },
            headerTemplateUrl: './core/templates/header.html',
            iboxToolsTemplateUrl: './core/templates/common/ibox_tools.html'
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
                .when('/login', _viewOptions['login'])
                .when('/register', _viewOptions['register'])
                .when('/forgot_password', _viewOptions['forgot_password'])
                .when('/lockscreen', _viewOptions['lockscreen'])
                .when('/400', _viewOptions['400'])
                .when('/500', _viewOptions['500'])

        }]);

        /**
         * dropZone - Directive for Drag and drop zone file upload plugin
         */
        function dropZone() {
            return function(scope, element, attrs) {
                element.dropzone({
                    url: "/upload",
                    maxFilesize: 100,
                    paramName: "uploadfile",
                    maxThumbnailFilesize: 5,
                    init: function() {
                        scope.files.push({file: 'added'});
                        this.on('success', function(file, json) {
                        });
                        this.on('addedfile', function(file) {
                            scope.$apply(function(){
                                alert(file);
                                scope.files.push({file: 'added'});
                            });
                        });
                        this.on('drop', function(file) {
                            alert('file');
                        });
                    }
                });
            }
        }
        /**
         * fullScroll - Directive for slimScroll with 100%
         */
        function fullScroll($timeout){
            return {
                restrict: 'A',
                link: function(scope, element) {
                    $timeout(function(){
                        element.slimscroll({
                            height: '100%',
                            railOpacity: 0.9
                        });

                    });
                }
            };
        }

        /**
         *   - Directive for iBox tools elements in right corner of ibox
         */
        function iboxTools($timeout) {
            return {
                restrict: 'A',
                scope: true,
                templateUrl: _viewOptions.iboxToolsTemplateUrl,
                controller: function ($scope, $element) {
                    // Function for collapse ibox
                    $scope.showhide = function () {
                        var ibox = $element.closest('div.ibox');
                        var icon = $element.find('i:first');
                        var content = ibox.find('div.ibox-content');
                        content.slideToggle(200);
                        // Toggle icon from up to down
                        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                        ibox.toggleClass('').toggleClass('border-bottom');
                        $timeout(function () {
                            ibox.resize();
                            ibox.find('[id^=map-]').resize();
                        }, 50);
                    },
                        // Function for close ibox
                        $scope.closebox = function () {
                            var ibox = $element.closest('div.ibox');
                            ibox.remove();
                        }
                }
            };
        };

        /**
         * landingScrollspy - Directive for scrollspy in landing page
         */
        function landingScrollspy(){
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.scrollspy({
                        target: '.navbar-fixed-top',
                        offset: 80
                    });
                }
            }
        }

        /**
         * fitHeight - Directive for set height fit to window height
         */
        function fitHeight(){
            return {
                restrict: 'A',
                link: function(scope, element) {
                    element.css("height", $(window).height() + "px");
                    element.css("min-height", $(window).height() + "px");
                }
            };
        }

        function goLiveHeader(){
            return {
                restrict: 'AE',
                templateUrl:_viewOptions.headerTemplateUrl
            };
        }

        /**
         *
         * Pass all functions into module
         */
        core
            .directive('iboxTools', iboxTools)
            .directive('dropZone', dropZone)
            .directive('fullScroll', fullScroll)
            .directive('landingScrollspy', landingScrollspy)
            .directive('fitHeight', fitHeight)
            .directive('chosen',['$timeout', function($timeout) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attr) {
                         scope.$watch('name', function() {
                            $timeout(function() { element.trigger('chosen:updated'); }, 0, false);
                         }, true);
                        $timeout(function() { element.chosen(); }, 0, false);
                    }
                };
            }])
            .directive('goLiveHeader', goLiveHeader)
            .directive('routeUi',['$location', function($location){
                return {
                    restrict: 'A',
                    link:function(scope, element, attr){
                        element.on('click', function(e){
                            e.stopPropagation();
                            window.location.hash= '#/'+this.attributes[0].value;
                           //$location.path('/'+this.attributes[0].value);
                        })

                    }
                };
            }])
            .controller('authController', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
                $scope.initLoginForm = function() {
                    $scope.form = {
                        email: 'me.ashish005@gmail.com',
                        password: '123456'
                    }
                };
                $scope.initRegisterForm = function() {
                    $scope.form = {
                        name: 'Ashish Chaturvedi',
                        mobile:'9873210774',
                        email: 'me.ashish005@gmail.com',
                        password: '123456',
                        confPassword: "123456",
                        isAgreed: true
                    }
                };
                $scope.submitRegisterForm = function() {
                    console.log("posting data....");
                    console.log( $scope.form);
                    var _req = {method: 'POST', url: 'api/core/signup', data: $scope.form};
                    ajaxRequest(_req, function(data, status, headers, config) {
                        // this callback will be called asynchronously when the response is available.
                        $location.path('/login');
                    }, function(data, status, headers, config) {
                        // this callback will be called asynchronously when the response is available.
                    });
                };
                $scope.submitLoginForm = function() {
                    var _req = {method: 'POST', url: 'api/core/signin', data: $scope.form};
                    ajaxRequest(_req, function(data, status, headers, config) {
                        $location.path('/dashboard');// this callback will be called asynchronously when the response is available.
                    }, function(data, status, headers, config) {
                        console.log('error: ', data );// this callback will be called asynchronously when the response is available.
                    });
                };

                function ajaxRequest(request ,successCallback, errorCallback){
                    $http(request).success(successCallback).error(errorCallback);
                }

            }
        ])
    });
})(window.define, window.angular);