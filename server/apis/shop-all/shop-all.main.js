/**
 * Created by wizdev on 10/12/2015.
 */
module.exports = function(server, router, mongoose) {
    var db = mongoose.createConnection('mongodb://127.0.0.1:27017/shopDB');
    db.Schema = mongoose.Schema;
    var productCategory = require('./models/product-category.model.js')(db);

    router.get('/products/', function(req, res) {
        productCategory.find({}, {}, function (err, _doc) {
            if(err) throw err;

            function treeModel(item){
                var _item = {
                    id: item.id,
                    name: item.category,
                    child:[],
                    parentId: item.parentId
                };
                return _item;
            }

            var _resp =  _.object(_.pluck(_doc[0], 'id'), _doc[0]);
            var result = {
                data:[],
                createTree : function(data, result){
                    var tree = [];
                    function iterateTree(data, result){
                        for (var i = 0; i < data.length; i++) {
                            var _item = treeModel(data[i].toObject());

                            var child = _.where(_resp, { parentId: number(_item.id)?_item.id:null} );
                            if (child) {
                                iterateTree(child, _item.child);
                            }
                            result.push(_item);
                        };
                    };
                    iterateTree(data, result);
                    return tree;
                }
            };
            var filtered = _resp[null];
            result.createTree(filtered, result.data);
            res.json(result.data);
        });
    });
}