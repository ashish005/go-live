/**
 * Created by wizdev on 10/23/2015.
 */
module.exports = function (server, router, mongoose) {
    var auth = require('./models/auth.model')(mongoose);
    var core = require('./models/core.model')(mongoose);
    var users = require('./models/users.model')(mongoose);

    router.get('/core', function(req, res) {
        core.find({}, {}, function (err, _doc) {
            if(err) throw err;
            res.json(_doc);
        });
    });

    router.post('/core/signup', function(req, res) {
        var _model = req.body;
        users.count({email: _model.email}, function (err, count){
            if(count>0){
                //document exists });
                res.json({isSuccess:true, message:'You are already registered with us..!'});
            }else{
                users.findOne().sort('-id').exec(function(err, item) {
                    var id = (item)? item.id+1:1;
                    users({
                        id: id,  // item.id is the max value
                        name:_model.name,
                        mobile :_model.mobile,
                        email: _model.email,
                        password : _model.password,
                        confPassword : _model.confPassword,
                        agreeWithTerms: _model.agreeWithTerms,
                        createdBy: req.headers['referer'],
                    }).save(function(err, doc) {
                        if(err) {
                            return res.status(400).send(err);
                        }
                        return res.status(200).send({isSuccess:true, message:'You registered with us succesfully..!'});
                    });
                });
            }
        });
    });

    router.post('/core/signin', function(req, res) {
        var _model = req.body;
        users.findOne({email: _model.email, password : _model.password}, function (err, _doc){
            if(err) {
                return res.status(400).send(err);
            }
            return res.status(200).send({isSuccess:true, message:''});
        });
    });

    router.get('/core/collections', function(req, res) {
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

    router.get('/core/users', function(req, res) {
        users.find({}, function (err, _doc){
            if(err) {
                return res.status(400).send(err);
            }
            return res.status(200).send({isSuccess:true, message:'', data:_doc});
        });
    });

    router.get('/core/collection/data', function(req, res) {
       var collection = req.query;
        mongoose.model(collection['name']).find({}, function (err, _doc){
            if(err) {
                return res.status(400).send(err);
            }
            return res.status(200).send({isSuccess:true, message:'', data:_doc});
        });
    });

}