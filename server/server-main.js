/**
 * Created by Ashish on 10/12/2015.
 */
module.exports = function() {
    var express = require('express'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        cors = require('cors'),
        http = require('http');

    var server = express(); // Set up an express server (but not starting it yet)

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(bodyParser.json());
    server.use(cors());

    var port = process.env.PORT || 4000;        // set our port
    server.set('port', port);

    var serverConfig = {
        basePath: './routers/',
        dbUrl:'127.0.0.1:27017/goLive'
    };

    // Add live reload
    //server.use(livereload({port: livereloadport}));
    //============================================================================
    var router = express.Router();// get an instance of the express Router
    require(serverConfig.basePath+'server.routers')(server, router, mongoose);//Define All routes here


    mongoose.connect('mongodb://'+ serverConfig.dbUrl, function (error, db) {
        console.log('mongo database Url: ' + serverConfig.dbUrl);
    });
    mongoose.connection.on("open", function(){
        console.log("mongodb is connected on " + serverConfig.dbUrl);
    });
    mongoose.connection.on("close", function(){
        console.log("mongodb is closed from" + serverConfig.dbUrl);
    });

    server.listen(server.get('port'), function () {
        console.log('I am listening ' + server.get('port'));
    });
    return {server: server, express:express};
}