/**
 * Created by wizdev on 12/8/2015.
 */
module.exports = function(mongoose){
    var roles = [0,1, 2 ,3 ,4];

    var varificationType = ['pending', 'email','mobile'];

    var usersSchema = new mongoose.Schema({
        id: {type: Number, required: true, default:0},
        name:{type: String, required: true, default:'User Name'},
        mobile: {type: Number, required: true, default:0},
        email: {type: String, required: true, default:'goLive@goLive.com'},
        password: {type: String, required: true, default:''},
        confPassword: {type: String, required: true, default:''},
        agreeWithTerms: {type: Boolean, required: false, default:true},
        createdDate: {type: Date, required: true, default:Date.now()},
        createdBy: {type: String, required: true, default:''},
        isVerified: {type: Boolean, required: true, default:0},
        varificationType:{type: String, required: true, default:'pending', enum: varificationType},
        role:{type: Number, required: true, default: 0, enum: roles},
        pic:{type: String, required: false},
        updatedDate: {type: Date, required: true, default:Date.now()},
        updatedBy: {type: String, required: false},
        token: {type: String, required: true, default:0}
    });

    usersSchema.static('registerUser', function (req, callback) {
        var _model = req.body;
        this.count({email: _model.email}, function (err, count){
            if(count>0){
                //document exists });
                callback(undefined ,{isSuccess:true, message:'You are already registered with us..!'});
            }else{
                this.findOne().sort('-id').exec(function(err, item) {
                    var id = (item)? item.id+1:1;
                    usersSchema({
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
                            callback(err);
                        }
                        callback(undefined ,{isSuccess:true, message:'You registered with us succesfully..!'});
                    });
                });
            }
        });
    });

    usersSchema.static('signin', function (condition, callback) {
        this.find(condition, { _id: 0, role: 1, varificationType: 1, isVerified: 1, email: 1, mobile: 1, name: 1, pic: 1 }).lean().limit(1).exec(callback);
    });

    return mongoose.model('users', usersSchema, 'users');
};