/**
 * Created by wizdev on 11/21/2015.
 */
module.exports = function(express){


    /* GET users listing. */
    router.get('/', function(req, res) {
        res.send('respond with a resource');
    });

    return router;
}