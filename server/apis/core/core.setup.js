/**
 * Created by wizdev on 10/23/2015.
 */
module.exports = function (server, router, mongoose) {
    var auth = require('./models/auth.model')(mongoose);
    var core = require('./models/core.model')(mongoose);
    router.get('/core', function(req, res) {
        core.find({}, {}, function (err, _doc) {
            if(err) throw err;
            res.json(_doc);
        });
    });
}