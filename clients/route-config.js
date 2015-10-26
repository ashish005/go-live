/**
 * Created by wizdev on 10/25/2015.
 */
(function(window, require){
    "use strict";
    $('.link-navigator').on('click', function(e){
        window.location.href = e.currentTarget.attributes.key['value'];
    });
})(window, require);