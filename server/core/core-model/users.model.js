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

    usersSchema.static('findAll', function (callback) {
        this.find({}, {}).lean().exec(callback);
    });

    usersSchema.static('signin', function (condition, callback) {
        this.find(condition, { _id: 0, role: 1, varificationType: 1, isVerified: 1, email: 1, mobile: 1, name: 1, pic: 1 }).lean().limit(1).exec(callback);
    });

    return mongoose.model('users', usersSchema, 'users');
};