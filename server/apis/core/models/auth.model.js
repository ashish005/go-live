/**
 * Created by wizdev on 10/23/2015.
 */
module.exports = function(mongoose){
    var authSchema = new mongoose.Schema({
        id: {type: Number, required: true, default:0},
        email:{type: String, required: true, default:'goLive@goLive.com'},
        name: {type: String, required: true, default:'User Name'},
        token: {type: String, required: true, default:0}
    });

    return mongoose.model('auth', authSchema, 'auth');
};