/**
 * Created with IntelliJ IDEA.
 * User: wiznidev
 * Date: 05/11/15
 * Time: 4:27 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";
    define([window['name']], function (app) {
        //var app = angular.module('bootstrap-popup', ['ui.bootstrap']);
        app.factory("popupService", ['$q', "modalService",'popupViewOptions', '$timeout', function ($q, modalService, popupViewOptions, $timeout) {
            var modalDefaults = { backdrop: true, keyboard: true, modalFade: true, templateUrl: '', windowClass: 'default-popup' };
            var _model = {};
            _model.showProductPopup = function (type, model) {
                modalDefaults.windowClass = 'default-popup product-popup';
                modalDefaults.templateUrl = popupViewOptions['product'][type];
               return modalService.showModal(modalDefaults, model);
            };
            return _model;
        }]);
        app.service("modalService", ["$modal", function ($modal) {
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
})();