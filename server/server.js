/**
 * Created by wizdev on 11/20/2015.
 */

    module.exports = function() {
        var express = require('express'),
            bodyParser = require('body-parser'),
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
        server.set('views', __dirname + '/views');
        server.set('view engine', 'jade');

// Add live reload
//server.use(livereload({port: livereloadport}));
//============================================================================
        var mongoose = require('./database-connection')(server, express);
        var shopAllRouters = require('./shop-all/shop-all.routes')(server, express, mongoose);//Define All routes here

        shopAllRouters.get('/apis', function(req, res) {
            res.render('apis', { data:shopAllRouters.stack });
        });

        server.listen(server.get('port'), function () {
            console.log('I am listening ' + server.get('port'));
        });
        return {
            server:server,
            express:express
        }
    }