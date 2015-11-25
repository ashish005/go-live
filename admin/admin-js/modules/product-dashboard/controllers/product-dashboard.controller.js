/**
 * Created by wizdev on 11/25/2015.
 */
(function(define, angular){
    "use strict";
    define([window.appName, 'product-dashboard-service'], function (app) {
        app.controller('productDashboardController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', 'productDashboardService', 'popupService', 'popupView', 'treeOperations',
            function ($scope, $rootScope, $q, $compile, $routeParams, productDashboardService, popupService, popupView, treeOperations)
            {
                $scope.init = function (){
                    productDashboardService.getCategories().then(function (resp)
                    {
                        $scope.productCategory = resp['data'];
                    }, function (error) {});

                    $scope.show = function(info){
                        var _model = {
                            model : info['node'],
                            operation : treeOperations
                        };
                        popupService['showPopup'](popupView['product-dashboard']['tree']['templateUrl'], _model).then(function(resp){}, function(err){});
                    };
                };
            }
        ])
        .service('treeOperations', function () {
                this.delete = function(scope) {
                    var nodeData = scope.$modelValue;
                    if(nodeData) {
                        var _model = {ids: []};
                        _model['ids'].push(nodeData.id);
                        console.log(_model['ids']);
                    }
                };
                this.toggle = function(scope) {
                    scope.toggle();
                };
                this.edit = function(scope) {
                    var nodeData = scope.$modelValue;
                    if(nodeData) {
                        nodeData['isNew'] = true;
                    }
                };
                this.save = function(scope) {
                    var nodeData = scope.$modelValue;
                    nodeData['isNew'] = false;
                    var _model = {
                        id: nodeData.id,
                        name: nodeData.name,
                        parentId:nodeData.parentId
                    };
                };
                this.collapseAll = function(scope) {
                    scope.$broadcast('collapseAll');
                };
                this.expandAll = function(scope) {
                    scope.$broadcast('expandAll');
                };
                this.moveLastToTheBeginning = function (scope) {
                    var a = scope.data.pop();
                    scope.data.splice(0,0, a);
                };
                this.newSubItem = function(scope) {
                    var nodeData = scope.$modelValue;
                    if(nodeData) {
                        var _model = {
                            name: nodeData.name + '.' + (nodeData.child.length + 1),
                            parentId: nodeData.id,
                            child: []
                        };
                    }
                };
                function treeModel(item){
                    var _item = {
                        id: item.id,
                        name: item.category,
                        child:[],
                        parentId: item.parentId
                    };
                    return _item;
                }
            });
    });
})(window.define, window.angular);