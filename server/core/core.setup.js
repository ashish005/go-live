/**
 * Created by wizdev on 12/8/2015.
 */
module.exports = function (server, router, mongoose) {
    var core = mongoose.model('core');
    var users = mongoose.model('users');

    var reqHeaders = (function(){
        var model = {
            getHeader:function(headers){
                var header = {
                    host:headers['headers']['host'],
                    referer : headers['headers']['referer'],
                    ipAddress:'X-Forwarded-For'
                };
                return header;
            }
        };
        return model;
    })();

    router.get('/core', function(req, res) {
        var _model = reqHeaders.getHeader(req);
        var _filterParams = {host : _model.host};
        core.count(_filterParams, function (err, count){
            var resp = {isSuccess:true, message:'', data:null};
            if(count>0){
                //document exists });
                core.findOne(_model, {}, function (err, _doc) {
                    if(err){
                        resp.isSuccess = false;
                        resp['message'] = err;
                        return res.status(400).send(resp);
                    }
                    resp['data'] = _doc;
                    return res.status(200).send(resp);
                });
            }else{
                core.findOne().sort('-id').exec(function(err, item) {
                    _model['id'] = (item)? item['id']+1:1;
                    core(_model).save(function(err, _doc) {
                        if(err) {
                            resp.isSuccess = false;
                            resp['message'] = err;
                            return res.status(400).send(resp);
                        }
                        resp['data'] = _doc;
                        return res.status(200).send(resp);
                    });
                });
            }
        });
    });

    router.get('/core/preferences', function(req, res) {
        var _model = reqHeaders.getHeader(req);
        var _filterParams = {host : _model.host};
        mongoose.model('core').findOne(_filterParams, function (err, _doc){
            if(err) {
                return res.status(400).send(err);
            }
            return res.status(200).send({isSuccess:true, message:'', data:_doc});
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
        mongoose.model(collection['name']).find({},{_id:0}, function (err, _doc){
            if(err) {
                return res.status(400).send({isSuccess:false, message:err, data:_doc});
            }
            return res.status(200).send({isSuccess:true, message:err, data:_doc});
        });
    });

    router.post('/core/collection/item', function(req, res) {
        var collection = req.query;
        mongoose.model(collection['name']).findOne().sort('-id').exec(function(err, item) {
            mongoose.model(collection['name'])(req.body).save(function callback(err, doc) {
                if(err) {
                    return res.status(400).send({isSuccess:false});
                }
                return res.status(200).send({isSuccess:true});
            });
        });
    });

    router.put('/core/collection/item', function(req, res) {
        mongoose.model(collection['name']).update({id:req.body['id']}, req.body, { upsert:true }, function callback(err, doc) {
            if(err) {
                return res.status(400).send({isSuccess:false});
            }
            return res.status(200).send({isSuccess:true});
        });
    });

    router.delete('/core/collection/item', function(req, res) {
        mongoose.model(collection['name']).remove({id:{$in: req.query.ids}}, function(err, _doc){
            if(err) {
                return res.status(400).send({isSuccess:false});
            }
            return res.status(200).send({isSuccess:true});
        });
    });
}