/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bbdd = require("./bbdd");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
/*app.set('views', __dirname + '/views');
app.set('view engine', 'jade');*/


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
/*
app.get('/', routes.index);
app.get('/users', user.list);
*/
require('./bbdd')

app.get('/Reservas',function(req,res)
{
  res.send("Url Maoni para recibir los post de las reservas V2");
});
app.post('/Reservas',bbdd.addReserva, function(err,data){});
app.post('/Incidencias',bbdd.addIncidencia, function(err,data){});
app.get('/Usuarios/:IDUSUARIO/:PASSWORD',bbdd.UsuarioValido, function(err,data){});
app.get('/Hoteles/:IDUSUARIO',bbdd.HotelesByUsuario, function(err,data){});
//app.get('/Incidencias',bbdd.listaIncidenciaByHotel, function(err,data){});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
