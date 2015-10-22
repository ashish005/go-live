/**
 * Created by Ashish on 10/12/2015.
 */
var base = '/admin';//clients
var app = require('./server/server-main')(); //Run Server

app.server.use('/', app.express.static(__dirname + base));
app.server.get('/', function (req, res) {
    /*res.sendFile(__dirname  + '/clients/index.html');*/
    res.sendFile(__dirname  + base+'/index.html');
});