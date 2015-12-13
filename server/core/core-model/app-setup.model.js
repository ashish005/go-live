/**
 * Created by wizdev on 12/8/2015.
 */
(function (require, module) {
    module.exports = function(mongoose){

        var landingPage = ['', 'login'];

        var coreSchema = new mongoose.Schema({
            id: {type: Number, required: true, default:''},
            host: {type: String, required: true, default:''},
            referer: {type: String, required: true, default:''},
            ipAddress: {type: String, required: false},
            appLogo: {type: String, required: true, default:'data:image/png;charset=utf-8;base64,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'},
            appName: {type: String, required: true, default:'ACE+'},
            hasSearchFilterMenu: {type: Boolean, required: true, default:false},
            landingPage: {type: String, required: true, default:'', enum: landingPage},
        });

        coreSchema.static('findApp', function (condition, callback) {
            var _filterParams = {referer : { $in: [condition['referer'] ]}};
            this.findOne(_filterParams, {_id:0, __v: 0}).exec(callback);
        });
        return mongoose.model('core', coreSchema, 'core');
    };
})(require, module);