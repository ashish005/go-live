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
            iboxToolsTemplateUrl: './core/templates/common/ibox_tools.html',
            menuTree:'./core/templates/mega-menu.html',
        };

        core.factory('authenticationFactory', ["$window", function ($window) {
            var auth = {
                isLogged: false,
                userInfo:{
                    name: '',
                    email: '',
                    mobile:'',
                    role: '',
                    pic:'',
                    isAuthenticated  : false,
                },
                check: function () {
                    if ($window.localStorage.token && $window.localStorage.email)
                    {
                        this.isLogged = true;
                    } else {
                        this.isLogged = false;
                        delete this.user;
                    }
                },
                getInfo: function (user) {
                    this.setAuthInfoFromStorage();
                    return this.userInfo;
                },
                setInfo: function (user) {
                    this.userInfo['name'] = user['name'];
                    this.userInfo['email'] = user['email'];
                    this.userInfo['role'] = user['role'];
                    this.userInfo['mobile'] = user['mobile'];
                    this.userInfo['token']  = user['token'];
                    this.userInfo['pic']  = user['pic'];
                    this.userInfo['isAuthenticated'] = user['isVerified'];

                    $window.localStorage.token = this.userInfo['token'];
                    $window.localStorage.name = this.userInfo['name'];
                    $window.localStorage.email = this.userInfo['email'];
                    $window.localStorage.role = this.userInfo['role'];
                    $window.localStorage.mobile = this.userInfo['mobile'];
                    $window.localStorage.pic = this.userInfo['pic'];
                    $window.localStorage.isAuthenticated = this.userInfo['isAuthenticated'];
                },
                setAuthInfoFromStorage: function () {
                    this.userInfo['name'] =  $window.localStorage.name;
                    this.userInfo['email'] = $window.localStorage.email;
                    this.userInfo['role'] = $window.localStorage.role;
                    this.userInfo['mobile'] = $window.localStorage.mobile;
                    this.userInfo['token']  = $window.localStorage.token;
                    this.userInfo['pic'] = $window.localStorage.pic;
                    this.userInfo['isAuthenticated'] = $window.localStorage.isAuthenticated;
                },
                clearInfo: function () {
                    this.isLogged = false;

                    delete this.userInfo['name'];
                    delete this.userInfo['email'];
                    delete this.userInfo['role'];
                    delete this.userInfo['mobile'];
                    delete this.userInfo['token'];
                    delete this.userInfo['pic'];
                    delete this.userInfo['isAuthenticated'];

                        //Remove window session storage code
                    delete $window.localStorage.token;
                    delete $window.localStorage.name;
                    delete $window.localStorage.email;
                    delete $window.localStorage.role;
                    delete $window.localStorage.mobile;
                    delete $window.localStorage.pic;
                    delete $window.localStorage.isAuthenticated;
                },
                getAuthToken: function () {
                    return 'Bearer ' + $window.localStorage.token;
                }
            }
            return auth;
        }]);
        core.factory('tokenInterceptor', ['$q', '$location', 'authenticationFactory',function ($q, $location, authenticationFactory) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = 'Bearer'+ authenticationFactory.getAuthToken();
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
                        //delete $window.localStorage.token;//Remove window session storage code
                        authenticationFactory.clearInfo();
                        authenticationFactory.isAuthenticated = false;
                        $location.path("/login");
                    }
                    return $q.reject(rejection);
                }
            };
        }]);
        core.config(['$httpProvider', function ($httpProvider) {
            //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.defaults.headers.common["Accept"] = "*/*";
            $httpProvider.interceptors.push('tokenInterceptor');
            $httpProvider.defaults.cache = false;
            $httpProvider.defaults.timeout = 600000;
        }]);
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

        function goLiveHeader(authenticationFactory, $location){
            return {
                restrict: 'AE',
                templateUrl:_viewOptions.headerTemplateUrl,
                link: function(scope, element, attr){
                    element.on('click', '#clearInfo', function(e){
                        e.stopPropagation();
                        authenticationFactory.clearInfo();
                        scope.userInfo = null;
                        window.location.hash= 'login';
                    })
                }
            };
        }

        function treeMenu($location){
            return {
                restrict: 'AE',
                scope:{items:'='},
                template:'<div class="show-grid" ng-repeat="itemChilds in items track by $index">\
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="col-xs-2"><h1><span class="visible-lg-inline">{{itemChilds["name"]}}</span></h1></div><div class="col-xs-10"><div tree-menu items="itemChilds["child"]"></div></div></div>\
                </div>',
                link: function(scope, element, attr){}
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
            .directive('goLiveHeader', ['authenticationFactory', '$location', goLiveHeader])
            .directive('treeMenu', ['$location', treeMenu])
            .directive('routeUi',['$location', function($location){
                return {
                    restrict: 'A',
                    link:function(scope, element, attr){
                        element.on('click', function(e){
                            e.stopPropagation();
                            window.location.hash= '/'+eval(attr)['routeUi'];
                        })
                    }
                };
            }])
            .controller('authController', ['$scope', '$rootScope', '$http', '$location', 'authenticationFactory', function ($scope, $rootScope, $http, $location, authenticationFactory) {
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
                        authenticationFactory.setInfo(data['data']);
                        window.location.href = "shop-all";
                        //$location.path('/shop-all');// this callback will be called asynchronously when the response is available.
                    }, function(data, status, headers, config) {
                        console.log('error: ', data );// this callback will be called asynchronously when the response is available.
                    });
                };

                function ajaxRequest(request ,successCallback, errorCallback){
                    $http(request).success(successCallback).error(errorCallback);
                }

            }
        ]);
    });
})(window.define, window.angular);