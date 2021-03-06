/**
 * Created by wizdev on 11/21/2015.
 */
(function(define, angular){
    "use strict";
    var _mod = window['name'] + '.core';
    var core = angular.module(_mod, ['ui.bootstrap', 'ngRoute']);

    var _coreBase = 'js-modules/core/templates/';
    var _viewOptions = {
        headerTemplateUrl: _coreBase + 'header.html',
        login: {
            templateUrl: _coreBase + 'login.html'
        },
        register: {
            templateUrl: _coreBase + 'register.html'
        },
        forgot_password: {
            templateUrl: _coreBase + 'forgot-password.html'
        },
        lockscreen:{
            templateUrl: _coreBase + 'lockscreen.html'
        },
        400:{
            templateUrl: _coreBase + 'error/page-not-found.html'
        },
        500:{
            templateUrl: _coreBase + 'error/internal-server-error.html'
        },
    };

    function popupService($q, modalService) {
        var modalDefaults = { backdrop: true, keyboard: true, modalFade: true, templateUrl: '', windowClass: 'default-popup' };
        var _model = {};
        _model.showPopup = function (templateUrl, model) {
            modalDefaults['templateUrl'] = templateUrl;
            return modalService.showModal(modalDefaults, model);
        };
        return _model;
    }

    function modalService($modal) {
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
    }

    function goLiveHeader($location){
        return {
            restrict: 'AE',
            templateUrl:_viewOptions.headerTemplateUrl,
            link: function(scope, element, attr){
                element.on('click', '#clearInfo', function(e){
                    e.stopPropagation();
                })
            }
        };
    };

    function authenticationFactory($window) {
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
    }

    function tokenInterceptor($q, $location, authenticationFactory) {
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
    }

    function authController($scope, $rootScope, $http, $location, authenticationFactory, coreApis) {
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
            coreApis.registerUser($scope.form).then(function(data, status, headers, config){
                    $location.path('/login');
                }, function(error){});
        };
        $scope.submitLoginForm = function() {
            coreApis.login($scope.form).then(function(data, status, headers, config){
                authenticationFactory.setInfo(data['data']);
                $location.path('/shop-all');
            }, function(error){});
        };
    }

    function routeProvider ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', _viewOptions['login'])
            .when('/register', _viewOptions['register'])
            .when('/forgot_password', _viewOptions['forgot_password'])
            .when('/lockscreen', _viewOptions['lockscreen'])
            .when('/400', _viewOptions['400'])
            .when('/500', _viewOptions['500'])
    };

    function coreApis($http, $rootScope, $location) {
        function ajaxRequest(request){
           return $http(request);
        }
        var apis = {
            coreBase:'http://localhost:4001/core',
            initApp: function(){
                var _req = {method: 'GET', url: this.coreBase};
                $http(_req).then(function (resp)
                {
                    core.constant('appInfo', resp['data']);
                    $rootScope.appInfo = resp['data'];
                    /*if(resp['data']) {
                        $location.path(resp['data']['landingPage']);
                    }*/
                }, function (error) {
                    throw new Error('Core is not initialized : ' + error);
                });
            },
            registerUser:function(data){
                var _req = {method: 'POST', url: this.coreBase+'/signup', data: data};
                return ajaxRequest(_req);
            },
            login:function(data){
                var _req = {method: 'POST', url: this.coreBase+'/signin', data: data};
                return ajaxRequest(_req);
            }
        };

        return apis;
    };

    core
        .factory("popupService", ['$q', "modalService", popupService])
        .service("modalService", ["$modal", modalService])
        .directive('goLiveHeader', ['$location', goLiveHeader])
        .factory('authenticationFactory', ["$window", authenticationFactory])
        .factory('tokenInterceptor', ['$q', '$location', 'authenticationFactory', tokenInterceptor])
        .config(['$routeProvider', '$locationProvider', routeProvider])
        .controller('authController', ['$scope', '$rootScope', '$http', '$location', 'authenticationFactory', 'coreApis', authController])
        .service("coreApis", ["$http", '$rootScope', '$location', coreApis])
        .run(['coreApis',  function(coreApis) {
            coreApis.initApp();
        }]);
})(window.define, window.angular);