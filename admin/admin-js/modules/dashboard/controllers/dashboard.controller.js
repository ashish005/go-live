/**
 * Created by wizdev on 10/24/2015.
 */
(function(define, angular){
    "use strict";
    define([window.appName, 'dashboard-service'] , function (app) {
        app.controller('dashboardController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http', 'popupService', 'popupView', 'dashboardService',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http, popupService, popupView, dashboardService)
            {
                $scope.init = function (){
                    $scope.form = {};
                    dashboardService.getAllCollections().then(function (resp, status, headers, config) {
                        $scope.form.collection = resp['data']['data'];
                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }
                    }, function (data, status, headers, config) {});

                    $scope.selectAction = function() {
                        dashboardService.getActiveCollection($scope.form['actveOpt']).then(function (resp, status, headers, config) {
                            $scope.collectionData = resp['data']['data'];
                            createTreeData(resp['data']['data']);
                            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                $scope.$apply();
                            }
                        }, function (data, status, headers, config) {});
                    };
                };

                function createTreeData(plainData){

                    var _nodeSvc = dashboardService.nodes;

                    $scope.delete = function(scope) {
                        scope.remove();
                        var nodeData = scope.$modelValue;
                        var _model = {
                            ids:[]
                        };
                        _model['ids'].push(nodeData.id);

                        /*var ids = (function(data){
                            var that = this;
                            angular.forEach(nodeData.child, function(item, index){
                                _model['ids'].push(item.id);
                                that.$applyAsync(that, item.child);
                            });
                        })(nodeData.child);*/

                        console.log(_model['ids']);
                       /* _nodeSvc.delete(_model).then(function (resp) {
                            _model['isNew'] = true;
                        },function (err) {
                            _model['isNew'] = false;
                        });*/
                    };
                    $scope.toggle = function(scope) {
                        scope.toggle();
                    };
                    $scope.moveLastToTheBeginning = function () {
                        var a = $scope.data.pop();
                        $scope.data.splice(0,0, a);
                    };
                    $scope.newSubItem = function(scope) {
                        var nodeData = scope.$modelValue;
                        var _model = {
                            name: nodeData.name + '.' + (nodeData.child.length + 1),
                            parentId:nodeData.id,
                            child: []
                        };
                        _nodeSvc.add(_model).then(function (resp) {
                            _model['id'] =  nodeData.id * 10 + nodeData.child.length,
                            _model['isNew'] = true;
                            nodeData.child.push(_model);
                        },function (err) {
                            _model['isNew'] = false;
                        });
                    };
                    $scope.edit = function(scope) {
                        var nodeData = scope.$modelValue;
                        nodeData['isNew'] = true;
                    };

                    $scope.save = function(scope) {
                        var nodeData = scope.$modelValue;
                        nodeData['isNew'] = false;
                        var _model = {
                            id: nodeData.id,
                            name: nodeData.name,
                            parentId:nodeData.parentId
                        };
                        _nodeSvc.update(_model).then(function (resp) {
                            _model['isNew'] = true;
                        },function (err) {
                            _model['isNew'] = false;
                        });
                    };

                    $scope.collapseAll = function() {
                        $scope.$broadcast('collapseAll');
                    };
                    $scope.expandAll = function() {
                        $scope.$broadcast('expandAll');
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
                    var dataOutput = plainData;
                    var _resp =  _.object(_.pluck(dataOutput, 'id'), dataOutput);
                    $scope.data = (function(arr){
                        var tree = [],
                            mappedArr = {},
                            arrElem,
                            mappedElem;

                        // First map the nodes of the array to an object -> create a hash table.
                        _.each(arr, function(item){
                            arrElem = item;
                            mappedArr[arrElem['id']] = treeModel(arrElem);
                            mappedArr[arrElem['id']]['child'] = [];
                        });

                        for (var id in mappedArr) {
                            if (mappedArr.hasOwnProperty(id)) {
                                mappedElem = mappedArr[id];
                                // If the element is not at the root level, add it to its parent array of children.
                                if (mappedElem.parentId) {
                                    if(mappedElem['parentId'] && mappedArr[mappedElem['parentId']])
                                        mappedArr[mappedElem['parentId']]['child'].push(mappedElem);
                                }
                                // If the element is at the root level, add it to first level elements array.
                                else {
                                    tree.push(mappedElem);
                                }
                            }
                        }
                        return tree;
                    })(_resp);
                }

                var model = (function(data){
                    return {
                           model: {
                                name:$scope.form['actveOpt']['name'],
                                info:data
                            }
                        };
                });

                var ops = {
                    view:{
                        prePopupSvc:popupService['showPopup'],
                        template:popupView['dashboard']['view']['templateUrl'],
                        postPopupSvc: {
                            serviceToCall: function(){},
                            success: function(resp){},
                            failure: function(resp){},
                        },
                        type: 'view',
                        name: 'View'
                    },
                    edit:{
                        prePopupSvc:popupService['showPopup'],
                        template:popupView['dashboard']['edit']['templateUrl'],
                        postPopupSvc: {
                            serviceToCall: dashboardService.edit,
                            success: function(resp){},
                            failure: function(resp){},
                        },
                        type: 'edit',
                        name: 'Edit'
                    },
                    delete:{
                        prePopupSvc:popupService['showPopup'],
                        template:popupView['dashboard']['delete']['templateUrl'],
                        postPopupSvc: {
                            serviceToCall: dashboardService.delete,
                            success: function(resp){},
                            failure: function(resp){},
                        },
                        type: 'delete',
                        name: 'Delete'
                    },
                    tree:{
                        prePopupSvc:popupService['showPopup'],
                        template:popupView['dashboard']['tree']['templateUrl'],
                        postPopupSvc: {
                            serviceToCall:function(){},
                            success: function(resp){},
                            failure: function(resp){},
                        },
                        type: 'tree',
                        name: 'Tree'
                    },
                };

                $scope.ActionCallBack = function(type, data){
                    performOps(ops[type], new model(data));
                }

                function performOps(operation, _model){
                    operation.prePopupSvc(operation.template, _model).then(function(resp){
                        var svc = operation['postPopupSvc'];
                        svc['serviceToCall'](resp.model).then(svc['success'], svc['failure']);
                    }, function(err){});
                }
            }
        ]);
    });
})(window.define, window.angular);