/**
 * Created by wizdev on 11/21/2015.
 */

var app = require('./server/server')(); //Run Server
app.server.use('/', app.express.static(__dirname + '/client'));
app.server.get('/', function (req, res) {
    res.sendFile('client/index.html' , { root : __dirname});
});
app.server.listen(4002, function () {
    console.log('I am listening ' + 4002);
});

app.server.use('/images', app.express.static(__dirname + '/images'));

var admin = require('./server/admin')(); //Run Server
admin.server.use('/', admin.express.static(__dirname + '/admin'));
admin.server.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile('admin/index.html' , { root : __dirname});
});