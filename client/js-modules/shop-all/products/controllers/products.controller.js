/**
 * Created by wizdev on 11/21/2015.
 */
(function(define, angular){
    "use strict";
    angular
        .module(window['name'])
        .controller('productController', ['$scope', '$rootScope', '$q', '$compile','$routeParams', '$http',
            function ($scope, $rootScope, $q, $compile, $routeParams, $http)
            {
                $scope.init = function (){};
                $scope.products = new Array(40);
            }
        ])
        .directive('product', ['popupService', 'popupView', function(popupService, popupView){
        return{
            scope:{
                item:'='
            },
            template:'<div class="ibox-content product-box">\
            <a class="more-info btn btn-xs btn-outline btn-primary">more <i class="fa fa-long-arrow-right"></i></a>\
            <a class="shortlist btn btn-xs btn-outline btn-primary text-right"><i class="fa fa-long-arrow-right"></i> Shortlist </a>\
                <div class="product-imitation">[ INFO ]</div>\
                <div class="product-desc"> <small class="text-muted">Category</small> <div class="small m-t-xs"> $10 </div> <div class="small m-t-xs"> Many desktop publishing packages and web page editors now. </div> </div>\
            </div>',
            controller:function($scope, $element){
                $element.find('.btn.btn-xs.btn-outline.btn-primary').on('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    popupService.showPopup(popupView['product']['show'], {}).then(function(){}, function(){});
                });
            }
        };
    }]);
})(window.define, window.angular);