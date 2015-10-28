/**
 * Created by wizdev on 10/13/2015.
 */
(function(window, require){
    "use strict";
     var _basePath={
         libs:'assets/libs/',
         plugins:'common/plugins/'
     };
    window['name'] = 'goLive';
    require.config({
        urlArgs: 'v=1.0',
        waitSeconds: 200,
        // alias libraries paths
        paths: {
            'goLive':"route-config",
            jQuery: _basePath.libs +'jquery/jquery-2.1.1.min',
            angular: _basePath.libs +'angular/angular',
            angularAMD:  _basePath.libs +'angular/angularAMD.min',
            ngRoute:  _basePath.libs +'angular/angular-route',
            bootstrap:_basePath.libs +'bootstrap/bootstrap.min',
            'ui-bootstrap':_basePath.libs +'bootstrap/ui-bootstrap-tpls-0.12.0.min',

            'core':'core/core.directives',

            //Plugins
            'jquery-easing':_basePath.libs +'jquery/jquery-easing-1.3',
            'jquery-transit-modified':_basePath.libs +'jquery/jquery-transit-modified',
            'layerslider-transitions':_basePath.plugins +'full-width-slider/layerSlider/layerslider.transitions',
            'layer-slider':_basePath.plugins +'full-width-slider/layerSlider/layerslider.kreaturamedia.jquery',
            'full-width-slider':_basePath.plugins + 'full-width-slider/full-width-slider',
        },
        shim: {
            angularAMD: ['angular'],
            angular: {
                exports: "angular"
            },
            ngRoute: {
                deps: ["angular"]
            },
            core:{
                deps: [ 'ngRoute']
            },
            bootstrap:{
                deps:['jQuery']
            },
            'ui-bootstrap':{
                deps: ['jQuery', 'angular']
            },
            'jquery-easing':{ deps: ['jQuery'], exports: 'jquery-easing'},
            'jquery-transit-modified':{ deps: ['jquery-easing'], exports: 'jquery-transit-modified' },
            'layer-slider':{ deps: ['jquery-transit-modified', 'layerslider-transitions'], exports: 'layer-slider' },
            goLive:{
                deps: ['jQuery', 'core', 'bootstrap','ui-bootstrap']
            },
        },
        deps: [window['name']]
    });
})(window, require);