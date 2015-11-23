/**
 * Created by wizdev on 7/12/2015.
 */
(function(define, angular){
    "use strict";
    var core = angular.module('goLive.core', ['ngRoute']);
    define(['angularAMD'], function (angularAMD) {
        var _coreBase = 'admin-js/core/templates/';
        var _viewOptions = {
            login: {
                templateUrl: _coreBase+'login.html'
            },
            register: {
                templateUrl: _coreBase+'register.html'
            },
            forgot_password: {
                templateUrl: _coreBase+'forgot-password.html'
            },
            lockscreen:{
                templateUrl: _coreBase+'lockscreen.html'
            },
            400:{
                templateUrl: _coreBase+'page-not-found.html'
            },
            500:{
                templateUrl: _coreBase+'internal-server-error.html'
            },
            headerTemplateUrl: _coreBase+'header.html',
            iboxToolsTemplateUrl: _coreBase+'common/ibox_tools.html'
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

        function goLiveActions(){
            return {
                restrict: 'AE',
                scope:{
                    data:'=?',
                    performCallBack:'&?'
                },
                template:'<div class="btn-group" style="height: 20px;"><button class="btn-white btn btn-xs view">View</button><button class="btn-white edit"><i class="fa fa-pencil"></i></button><button class="btn-white delete"><i class="fa fa-trash"></i> </button></div>',//<button class="btn-white tree">Tree</button>
                controller: function($scope, $element){
                    $element.on('click', '.btn-white.btn.btn-xs.view', function(e){
                        e.stopPropagation();
                        $scope.performCallBack()('view', $scope.data);
                    });
                    $element.on('click', '.btn-white.edit', function(e){
                        e.stopPropagation();
                        $scope.performCallBack()('edit', $scope.data);
                    });
                    $element.on('click', '.btn-white.delete', function(e){
                        e.stopPropagation();
                        $scope.performCallBack()('delete', $scope.data);
                    });
                    /*$element.on('click', '.btn-white.tree', function(e){
                        e.stopPropagation();
                        $scope.performCallBack()('tree', $scope.treeData);
                    });*/
                }
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
            .directive('actions', goLiveActions)
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

            }])
            .factory("popupService", ['$q', "modalService", '$timeout', function ($q, modalService, $timeout) {
            var modalDefaults = { backdrop: true, keyboard: true, modalFade: true, templateUrl: '', windowClass: 'default-popup' };
            var _model = {};
            _model.showPopup = function (template, model) {
                modalDefaults.windowClass = 'default-popup';
                modalDefaults.templateUrl = template;
                return modalService.showModal(modalDefaults, model);
            };
            return _model;
        }])
            .service("modalService", ["$modal", function ($modal) {
            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: '',
                windowClass: ''
            };
            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };
            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $modalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                }
                return $modal.open(tempModalDefaults).result;
            };
        }]);
    });
})(window.define, window.angular);