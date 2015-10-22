/**
 * Created by wizdev on 10/22/2015.
 */
var _basePath = {
    common:'js/common-plugins/',
    modules:'js/modules/',
    core:'js/core/',
    admin:'js/admin/'
};

require.config({
    urlArgs: 'v=1.0',
    waitSeconds: 200,
    // alias libraries paths
    paths: {
        'goLive': 'admin-main',
        angular: "assets/libs/angular/angular",
        angularAMD: 'assets/libs/angular/angularAMD.min',
        ngRoute: 'assets/libs/angular/angular-route',
        jQuery: 'assets/libs/jquery/jquery-2.1.1.min',
        bootstrap:'assets/libs/bootstrap/bootstrap.min',
        'ui-bootstrap':'assets/libs/bootstrap/ui-bootstrap-tpls-0.12.0.min',
        'kendo.all.min': 'assets/libs/kendo/kendo.all.min',
        'pako_deflate':'assets/libs/kendo/pako_deflate.min',
        'jszip': 'assets/libs/kendo/jszip.min',
        'underscore': 'assets/libs/underscore.min',
        'jqHighlight': 'assets/libs/jquery/jquery.highlight',

        'core':'admin-js/core/core.directives'
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
        core:{deps: ['angular', 'ngRoute']},
        goLive:{
            deps: ['bootstrap', 'ui-bootstrap', 'underscore', 'core']
        }
    },
    // kick start application
    deps: ['goLive']
});