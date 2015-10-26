/**
 * Created by wizdev on 10/24/2015.
 */
module.exports = function(mongoose){
    var roles = [0,1, 2 ,3 ,4];

    var varificationType = ['pending', 'email','mobile'];

     var usersSchema = new mongoose.Schema({
        id: {type: Number, required: true, default:0},
        name:{type: String, required: true, default:''},
        mobile: {type: Number, required: true, default:0},
        email: {type: String, required: true, default:''},
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
    });

    return mongoose.model('users', usersSchema, 'users');
};