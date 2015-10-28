/**
 * Created by wizdev on 9/20/2015.
 */
(function(define, angular){
    "use strict";
    define([window['name'], 'layer-slider'], function (app) {
        app.directive('fullWidthSlider', ['$timeout',function ($timeout) {
            return {
                restrict: 'AE',
                templateUrl:'common/plugins/full-width-slider/full-width-slider.html',
                link: function (scope, element, attrs) {
                    element.find('#layerslider').layerSlider({
                        skinsPath : 'assets/css/skins/',
                        skin : 'layer-slider',
                        thumbnailNavigation : 'hover',
                        autoStart: true,
                        responsive: true
                    });
                },
                controller:function($scope){
                    var INTERVAL = 3000,  base = './extra-items/images/slider-images/', slides = [];

                    for(var i=1; i<13; i++){
                        slides.push({id:"image01", src: base + i+".jpg"});
                    }


            }
            };
        }]);
    });
})(window.define, window.angular);

