/**
 * Created by wizdev on 10/25/2015.
 */
(function(window){
    window.name = 'shopAll';

    var _root = 'shop-all/';

    var _basePath = {
        libs: '../assets/libs/',
        core: '../core/',
        modules: _root +'modules/',
        plugins:_root +'plugins/'
    };
    require.config({
        urlArgs: 'v=1.0',
        waitSeconds: 200,
        // alias libraries paths
        paths: {
            'shopAll': 'shop-all-main',
            angular: _basePath.libs+"angular/angular",
            angularAMD:  _basePath.libs+'angular/angularAMD.min',
            ngRoute:  _basePath.libs+'angular/angular-route',
            jQuery:  _basePath.libs+'jquery/jquery-2.1.1.min',
            bootstrap: _basePath.libs+'bootstrap/bootstrap.min',
            'ui-bootstrap': _basePath.libs+'bootstrap/ui-bootstrap-tpls-0.12.0.min',
            'underscore':  _basePath.libs+'underscore.min',
            'jqHighlight':  _basePath.libs+'jquery/jquery.highlight',
            'jszip': _basePath.libs+'export-options/jszip',
            'ods': _basePath.libs+'export-options/ods',
            'shim': _basePath.libs+'export-options/shim',
            'xlsx': _basePath.libs+'export-options/xlsx',
            'slimscroll':_basePath.libs+'plugins/slimscroll/jquery.slimscroll.min',

            'core':_basePath.core+'core.directives',
            'popup-service':'../common/services/popup.service'
        },
        // angular does not support AMD out of the box, put it in a shim
        shim: {
            angularAMD: ['angular'],
            angular: {
                exports: "angular"
            },
            underscore: {
                exports: "_"
            },
            ngRoute: {
                deps: ["angular"]
            },
            bootstrap:{
                deps:['jQuery']
            },
            jqHighlight:{
                deps:['jQuery']
            },
            'ui-bootstrap':{
                deps: ['jQuery', 'angular']
            },
            slimscroll:{
                deps:['jQuery']
            },
            core:{deps: ['angular', 'ngRoute']},
            'shopAll':{
                deps: ['bootstrap', 'ui-bootstrap', 'underscore', 'core', 'slimscroll']
            }
        },
        // kick start application
        deps: [window['name']]
    });
})(window);