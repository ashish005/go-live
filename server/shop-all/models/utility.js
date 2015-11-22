/**
 * Created by wizdev on 11/7/2015.
 */
var _utility = {
    hashMapTree: function (arr) {
        var tree = [],
            mappedArr = {},
            arrElem,
            mappedElem;

        // First map the nodes of the array to an object -> create a hash table.
        for(var i = 0, len = arr.length; i < len; i++) {
            arrElem = arr[i];
            mappedArr[arrElem.id] = {id :arrElem.id,name:arrElem.assetClass, parentId: arrElem.parentId};
            mappedArr[arrElem.id]['child'] = [];
        }

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
    }
};
module.exports = _utility;