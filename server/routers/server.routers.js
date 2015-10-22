/**
 * Created by wizdev on 10/12/2015.
 */
module.exports = function (server, router, mongoose) {
    require('../apis/core/core.setup.js')(server, router, mongoose);
    require('../apis/shop-all/shop-all.main.js')(server, router, mongoose);

    server.use('/api', router); // all of our routes will be prefixed with /api
    module.exports = router;
}