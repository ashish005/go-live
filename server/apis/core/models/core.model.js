/**
 * Created by wizdev on 10/23/2015.
 */
module.exports = function(mongoose){
    var coreSchema = new mongoose.Schema({
        id: {type: Number, required: true, default:0},
        ipAddress: {type: String, required: true},
        logo: {type: String, required: false},
        appName: {type: String, required: true}
    });
    return mongoose.model('core', coreSchema, 'core');
};