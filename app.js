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


var allowCrossDomain = function(req, res, next)
{
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
if ('development' == app.get('env'))
{
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
app.delete('/Reservas/:ROWID',bbdd.deleteReserva, function(err,data){});
app.put('/Reservas/:ROWID',bbdd.updateReserva, function(err,data){});

app.post('/ReservasCli/:KEY',bbdd.addReservaCli, function(err,data){});
app.delete('/ReservasCli/:KEY/:IDHOTEL/:IDRESERVA',bbdd.deleteReservaCli, function(err,data){});
app.put('/ReservasCli/:KEY/:IDHOTEL/:IDRESERVA',bbdd.updateReservaCli, function(err,data){});

//http://localhost:3000/Reservas/1/20160301
app.get('/Reservas/:IDHOTEL/:ENTRADA', bbdd.getReservas, function(err,data){});


app.get('/EncuestasResumen/:IDHOTEL/:FECHA', bbdd.getEncuestasResumen, function(err,data){});
app.get('/EncuestasResumenRango/:IDHOTEL/:DESDE/:HASTA', bbdd.getEncuestasResumenRango, function(err,data){});
app.get('/getEncuestasResumenRangoSinAcumular/:IDHOTEL/:DESDE/:HASTA', bbdd.getEncuestasResumenRangoSinAcumular, function(err,data){});

app.post('/Incidencias',bbdd.addIncidencia, function(err,data){});
app.put('/Incidencias/:ROWID',bbdd.updateIncidencia, function(err,data){});

app.get('/Incidencia/:ROWID',bbdd.incidencia, function(err,data){});
app.get('/IncidenciasLast5/:IDHOTEL',bbdd.incidenciasLast5, function(err,data){});
app.get('/IncidenciasRango/:IDHOTEL/:DESDE/:HASTA',bbdd.incidenciasLastRango, function(err,data){});
app.get('/IncidenciasPorSemana/:IDHOTEL/:SEMANADESDE/:SEMANAHASTA',bbdd.incidenciasPorSemana, function(err,data){});

app.get('/Usuarios/:IDUSUARIO/:PASSWORD',bbdd.UsuarioValido, function(err,data){});
app.get('/UsuariosIos/:IDUSUARIO/:PASSWORD',bbdd.UsuarioValidoIos, function(err,data){});
app.get('/UsuariosAndroid/:IDUSUARIO/:PASSWORD',bbdd.UsuarioValidoAndroid, function(err,data){});

app.get('/Hoteles/:IDUSUARIO',bbdd.HotelesByUsuario, function(err,data){});
//app.get('/Incidencias',bbdd.listaIncidenciaByHotel, function(err,data){});

app.post('/EncuestaOk',bbdd.addEncuestaOk, function(err,data){});

app.get('/IndicesSatisfaccion/:IDHOTEL/:DESDE/:HASTA',bbdd.indicesSatisfaccion, function(err,data){});
app.get('/IndicesSatisfaccionSemana/:IDHOTEL/:ANYO/:WDESDE/:WHASTA',bbdd.indicesSatisfaccionSemana, function(err,data){});

app.get('/TopResolutivos/:IDEMPRESA/:ANYO',bbdd.topResolutivos, function(err,data){});

app.get('/IncidenciasNoNotificadas',bbdd.IncidenciasNoNotificadas, function(err,data){});

app.get('/Origen',bbdd.Origen, function(err,data){});

app.get('/Version',bbdd.Version, function(err,data){});

http.createServer(app).listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
