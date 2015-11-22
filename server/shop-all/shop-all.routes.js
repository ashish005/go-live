/**
 * Created by wizdev on 11/21/2015.
 */

var _ = require('underscore-node');
module.exports = function(server, express, mongoose){
    var router = express.Router();// get an instance of the express Router

   var category = require('../shop-all/models/product-category.model.js')(mongoose);
    /* GET users listing. */
    router.get('/', function(req, res) {
        res.send('respond with a resource');
    });

    var _product = function(req, res) {
        category.find({}, { _id:0, id:1, category:1, parentId:1}, function (err, _doc) {
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

            var dataOutput = _doc;
            var _resp =  _.object(_.pluck(dataOutput, 'id'), dataOutput);

            var result = (function(arr){
                var tree = [],
                    mappedArr = {},
                    arrElem,
                    mappedElem;

                // First map the nodes of the array to an object -> create a hash table.
                _.each(arr, function(item){
                    arrElem = item;
                    mappedArr[arrElem['id']] = treeModel(arrElem);
                    mappedArr[arrElem['id']]['child'] = [];
                });

                for (var id in mappedArr) {
                    if (mappedArr.hasOwnProperty(id)) {
                        mappedElem = mappedArr[id];
                        // If the element is not at the root level, add it to its parent array of children.
                        if (mappedElem.parentId) {
                            if(mappedElem['parentId'] && mappedArr[mappedElem['parentId']])
                                mappedArr[mappedElem['parentId']]['child'].push(mappedElem);
                        }
                        // If the element is at the root level, add it to first level elements array.
                        else {
                            tree.push(mappedElem);
                        }
                    }
                }
                return tree;
            })(_resp);

            res.status(200).send(result);
        });
    }

    router.get('/products', _product);
    server.use('/api', router);
    return router;

};