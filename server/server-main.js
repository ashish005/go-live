/**
 * Created by Ashish on 10/12/2015.
 */
module.exports = function() {
    var express = require('express'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        http = require('http');

    var server = express(); // Set up an express server (but not starting it yet)

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(bodyParser.json());

    var port = process.env.PORT || 4000;        // set our port
    server.set('port', port);

    var serverConfig = {
        basePath: './routers/'
    };

    // Add live reload
    //server.use(livereload({port: livereloadport}));
    //============================================================================
    var router = express.Router();// get an instance of the express Router
    require(serverConfig.basePath+'server.routers')(server, router, mongoose);//Define All routes here
    /*server.use('/', express.static(__dirname + '/'));*/

    mongoose.connect('mongodb://127.0.0.1:27017/shopDB', function (error, db) {
        console.log('mongo error: ' + error);
        console.log('mongo success: ' + db);
    });

    server.listen(server.get('port'), function () {
        console.log('I am listening ' + server.get('port'));
    });
    return {server: server, express:express};
}