/**
 * Created by wizdev on 10/13/2015.
 */
(function(window, require){
    "use strict";
 var _basePath={libs:'assets/libs/'};
    require.config({
        urlArgs: 'v=1.0',
        waitSeconds: 200,
        // alias libraries paths
        paths: {
            'main':"route-config",
            jQuery: _basePath.libs+ 'jquery/jquery-2.1.1.min'
        },
        shim: {
            main:{
                deps: ['jQuery']
            }
            //core:{deps: ['angular', 'ngRoute']}
        },
        deps: ['main']
    });
})(window, require);