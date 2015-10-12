/**
 * Created by Ashish on 10/12/2015.
 */
var app = require('./server/server-main')(); //Run Server
app.server.use('/', app.express.static(__dirname + '/client'));
app.server.get('/', function (req, res) {
    res.sendFile(__dirname  + '/clients/index.html');
});