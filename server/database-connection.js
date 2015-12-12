/**
 * Created by wizdev on 11/21/2015.
 */
(function (require, module) {
    module.exports = function(server, express){
        var mongoose = require('mongoose');
        var serverConfig = { dbUrl:'127.0.0.1:27017/goLive' };
        // Database
        mongoose.connect('mongodb://'+ serverConfig.dbUrl, function (error, db) {
            console.log('mongo database Url: ' + serverConfig.dbUrl);
        });

        mongoose.connection.on("open", function(){
            console.log("mongodb is connected on " + serverConfig.dbUrl);
        });

        mongoose.connection.on("close", function(){
            console.log("mongodb is closed from" + serverConfig.dbUrl);
        });
        return mongoose;
    };
})(require, module);
