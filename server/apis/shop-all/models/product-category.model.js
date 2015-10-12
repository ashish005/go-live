/**
 * Created by wizdev on 10/12/2015.
 */
module.exports = function(db){
    var productCategorySchema = new db.Schema({
        id : {type: Number, required: true},
        category : {type: String, required: true},
        parentId : {type: Number, required: true},
    });

    return db.model('productCategory', productCategorySchema, 'productCategory');
};