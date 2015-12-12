/**
 * Created by wizdev on 12/8/2015.
 */
(function (module, require) {
    var _base ={
        controller: '../core/controllers/',
        model: '../core/core-model/'
    };

    module.exports = function (app, mongoose) {
        var appSetupModel = require(_base['model'] + 'app-setup.model')(mongoose);
        var users = require(_base['model'] + 'users.model')(mongoose);

        var appSetupController = require(_base['controller'] + 'app-setup.controller')(appSetupModel);
        var authController = require(_base['controller'] + 'auth.controller')(users);


        app.get('/core', appSetupController.setupApp);
        app.get('/core/signup', authController.signup);
        app.get('/core/signin', authController.signin);

        app.get('/core/collections', function(req, res) {
             var db = mongoose.connection.db;
             var _collection = [];
             function setIntoCollection(collecton){
             if(collecton.collectionName != 'system.indexes') {
             _collection.push({name: collecton.collectionName});
             }
             }
             db.collections(function(error, collection) {
             if(error){
             res.status(400).send({isSuccess:false});
             }
             for (var index in collection) {
             setIntoCollection(collection[index]);
             }
             return res.status(200).send({isSuccess:true, data:_collection});
             });
         });

        app.get('/core/collection/data', function(req, res) {
            var collection = req.query;
            mongoose.model(collection['name']).find({},{_id:0}, function (err, _doc){
                if(err) {
                    return res.status(400).send({isSuccess:false, message:err, data:_doc});
                }
                return res.status(200).send({isSuccess:true, message:err, data:_doc});
            });
        });

        return app;
    };
})(module, require);