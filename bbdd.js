//MySQL
var db = require('node-mysql');
var cps = require('cps');
var DB = db.DB;
var BaseRow = db.Row;
var BaseTable = db.Table;
var utilities = require("./utilities");
/*
var box = new DB({
    host     : 'localhost',
    user     : 'root',
    password : 'maonipass77',

    database : 'maoniBD'


});*/

var box = new DB({
    //host     : '52.16.112.227',
    host     : 'localhost',
    user     : 'gomaonis_Aleix',
    password : 'Aleix.2302',
    database : 'gomaonis_maonibd'


});

//Generador de keys
function random (low, high)
{
    return Math.floor(Math.random() * (high - low) + low);
}

function getkey ()
{
    return random (1, 1000000);
}

var KEYS = []
KEYS.push (7604320);//DEBUG

function keyExists (key)
{
    var i = KEYS.indexOf(parseInt(key));
    return i > -1;
}

/**********************************************************************************************************************/

exports.Version =  function  (req, res, callback)
{    
    res.send("WSRESERVAS V 1.3");
    callback();
}

exports.deleteReserva =  function  (req, res, callback)
{
    utilities.logFile("DELETE RESERVA ROWID: " + req.params.ROWID);
   
    var sentencia = "DELETE from reservas WHERE ROWID = ?" ;
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query deleteReserva")
                conn.query (sentencia, [req.params.ROWID],function (err)
                {
                    conn.release();
                    if (!err)
                    {                        
                        utilities.logFile("reserva " + req.params.ROWID + " eliminada");
                        res.send({"result": "1"});
                    }
                    else
                    {
                        utilities.logFile("Error" + err);
                        res.send({"result": "0","err": err});
                    }
                });
            },
            function(res, cb) 
            {
                callback (null, JSON.stringify (res));
            }
        ], callback);
    }, callback);   
}

exports.addReserva =  function  (req, res, callback)
{
    utilities.logFile("POST Reservas");
   // console.log(req.body);
    
    var sentencia = "INSERT INTO reservas set ?";    
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                utilities.logFile("query addReserva");
                
                //delete req.body.__proto__;
                
                conn.query (sentencia, req.body, function (err)
                {
                    conn.release();
                    if (!err)
                    {
                        res.send({"result": "1"});

                        utilities.logFile("Reserva guardada");
                    }
                    else
                    {
                        res.send({"result": "0","err": err});

                        utilities.logFile("Error: " + err);
                        utilities.logFile("Sentencia: " + sentencia);
                        utilities.logFile("Body: " + JSON.stringify (req.body)); 
                    }
                });
            },
            function(res, cb) 
            {
                callback (null, JSON.stringify (res));
            }
        ], callback);
    }, callback); 
}

exports.updateReserva =  function  (req, res,callback)
{
    utilities.logFile("PUT Reservas");
   
    var sentencia = "UPDATE reservas set ? WHERE ROWID = ?" ;   
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query updateReserva")
                conn.query (sentencia, [req.body, req.params.ROWID],function (err)
                {
                    conn.release();
                    if (!err)
                    {                        
                        utilities.logFile("Reserva actualizada");
                    }
                    else
                    {
                        utilities.logFile("Error" + err);
                    }
                });
                
                res.send(req.body);
                
            },
            function(res, cb) 
            {
                callback (null, JSON.stringify (res));
            }
        ], callback);
    }, callback);   
}

exports.getReservas =  function  (req, res,callback)
{
    utilities.logFile("GET Reservas by IDHOTEL");
    
    var sentencia = "SELECT * FROM gomaonis_maonibd.reservas where IDHOTEL = ? AND ENTRADA > ? ORDER BY ROWID DESC"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query getReservas")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.ENTRADA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

exports.getEncuestasResumen =  function  (req, res,callback)
{
    utilities.logFile("GET EncuestasResumen");
    
    var sentencia = "SELECT * FROM gomaonis_maonibd.ENCUESTAS_RESUMEN where IDHOTEL = ? AND FECHA = ?"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query ENCUESTAS_RESUMEN")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.FECHA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

exports.getEncuestasResumenRango =  function  (req, res,callback)
{
    utilities.logFile("GET EncuestasResumenRango");
    
    //SELECT sum(ENVIADAS) as ENVIADAS, sum(OK) as OK, sum(KO) as KO FROM gomaonis_maonibd.ENCUESTAS_RESUMEN where IDHOTEL = 1 AND FECHA >= '2016-01-01' and FECHA <= '2016-12-31'
    var sentencia = "SELECT sum(ENVIADAS) as ENVIADAS, sum(OK) as OK, sum(KO) as KO,ifnull(((100.0 * (OK + KO)) / NULLIF(ENVIADAS, NULL)),0) AS RATIO FROM gomaonis_maonibd.ENCUESTAS_RESUMEN where IDHOTEL = ? AND FECHA >= ? and FECHA <= ?"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query ENCUESTAS_RESUMEN")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.DESDE, req.params.HASTA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

//app.post('/EncuestaOk/:IDHOTEL/:IDENCUESTA/:IDRESERVA/:FECHARESPUESTA',bbdd.addEncuestaOk, function(err,data){});
exports.addEncuestaOk =  function  (req, res, callback)
{
    utilities.logFile("POST Reservas");
   // console.log(req.body);
    
    var sentencia = "INSERT INTO encuestaOk set ?";    
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                utilities.logFile("query addEncuestaOk");
                conn.query (sentencia, req.body, function (err)
                {
                    conn.release();
                    if (!err)
                    {
                        res.send({"result": "1"});

                        utilities.logFile("encuestaOk guardada");
                    }
                    else
                    {
                        res.send({"result": "0","err": err});

                        utilities.logFile("Error: " + err);
                        utilities.logFile("Sentencia: " + sentencia);
                        utilities.logFile("Body: " + JSON.stringify (req.body)); 
                    }
                });
            },
            function(res, cb) 
            {
                callback (null, JSON.stringify (res));
            }
        ], callback);
    }, callback); 
}

exports.addIncidencia =  function  (req, res,callback)
{
    utilities.logFile("POST Incidencias");
   // console.log(req.body);
    
    var sentencia = "INSERT INTO Incidencias set ?";
    
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query addIncidencia")
                conn.query (sentencia, req.body,function (err)
                {
                    conn.release();
                    if (!err)
                    {
                        
                        utilities.logFile("Incidencia guardada");
                    }
                    else
                    {
                        utilities.logFile("Error" + err);
                    }
                });
                
                res.send(req.body);
                
            },
            function(res, cb) 
            {
                callback (null, JSON.stringify (res));
            }
        ], callback);
    }, callback);   
}

exports.updateIncidencia =  function  (req, res,callback)
{
    utilities.logFile("PUT Incidencias");
   
    var sentencia = "UPDATE Incidencias set ? WHERE ROWID = ?" ;
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query updateIncidencia")
                conn.query (sentencia, [req.body, req.params.ROWID],function (err)
                {
                    conn.release();
                    if (!err)
                    {                        
                        utilities.logFile("Incidencia actualizada");
                    }
                    else
                    {
                        utilities.logFile("Error" + err);
                    }
                });
                
                res.send(req.body);
                
            },
            function(res, cb) 
            {
                callback (null, JSON.stringify (res));
            }
        ], callback);
    }, callback);   
}

exports.incidencia =  function  (req, res,callback)
{
    utilities.logFile("GET incidencia");
    
    var sentencia = "select * from gomaonis_maonibd.DETALLE_INCIDENCIA where ROWID = ?"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query DETALLE_INCIDENCIA")
                conn.query (sentencia,  [req.params.ROWID], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

exports.incidenciasLast5 =  function  (req, res,callback)
{
    utilities.logFile("GET incidenciasLast5");
    
    var sentencia = "select * from gomaonis_maonibd.DETALLE_INCIDENCIA where IDHOTEL = ? order by solucionada ASC, FECHACREACION DESC LIMIT 5"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query DETALLE_INCIDENCIA")
                conn.query (sentencia,  [req.params.IDHOTEL], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

exports.incidenciasLastRango =  function  (req, res,callback)
{
    utilities.logFile("GET incidenciasLast5");
    
    var sentencia = "select * from gomaonis_maonibd.DETALLE_INCIDENCIA where IDHOTEL = ? AND FECHACREACION >= ? and FECHACREACION <= ? order by solucionada ASC, FECHACREACION DESC"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query DETALLE_INCIDENCIA")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.DESDE, req.params.HASTA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

exports.incidenciasPorSemana =  function  (req, res,callback)
{
    utilities.logFile("GET incidenciasPorSemana");
    
    var sentencia = "select * from CUENTA_QUEJAS_POR_SEMANA where IDHOTEL = ? AND SEMANA >= ? and SEMANA <= ? order by SEMANA,IDTIPO"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query CUENTA_QUEJAS_POR_SEMANA")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.SEMANADESDE, req.params.SEMANAHASTA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp); 
            }
        ], callback);
    }, callback);   
}

exports.indicesSatisfaccion =  function  (req, res,callback)
{
    utilities.logFile("GET indicesSatisfaccion");
    //call INDICES_SATISFACCION (1,'20160501','20160531')
    var sentencia = "call INDICES_SATISFACCION (?,?,?)"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query INDICES_SATISFACCION")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.DESDE, req.params.HASTA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp[0]); 
            }
        ], callback);
    }, callback);   
}

exports.indicesSatisfaccionSemana =  function  (req, res,callback)
{
    utilities.logFile("GET indicesSatisfaccion");
    var sentencia = "call INDICES_SATISFACCION_SEMANA (?,?,?,?)"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query INDICES_SATISFACCION_SEMANA")
                conn.query (sentencia,  [req.params.IDHOTEL, req.params.ANYO, req.params.WDESDE, req.params.WHASTA], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp[0]); 
            }
        ], callback);
    }, callback);   
}

exports.UsuarioValido =  function  (req, res,callback)
{
    utilities.logFile("GET UsuarioValido");
    
    var sentencia = "SELECT distinct DESCUSUARIO, E.IDEMPRESA, E.DESCEMPRESA FROM usuarios U inner join usuarioshoteles UO on UO.IDUSUARIO = U.IDUSUARIO inner join hoteles H on H.IDHOTEL = UO.IDHOTEL inner join empresas E on E.IDEMPRESA = H.IDEMPRESA where U.IDUSUARIO =  '" + req.params.IDUSUARIO + "'"; 
    sentencia += "and PASSWORD = '" + req.params.PASSWORD + "'";   
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query UsuarioValido")
                conn.query (sentencia, callback);
                    
            },
            function(resp, cb) 
            {
                conn.release();
                if (resp.length == 1)
                {
                    var key = getkey();
                    resp[0].SESSIONKEY = key;
                    KEYS.push(key);
                    res.send(resp);
                }
                else
                {
                    res.send([{"SESSIONKEY": 0}]);
                }
            }
        ], callback);
    }, callback);   
}

exports.HotelesByUsuario =  function  (req, res,callback)
{
    utilities.logFile("GET Hoteles By Usuario");
    
   // console.log(req.body);
    
    var sentencia = "SELECT E.DESCEMPRESA, H.* FROM gomaonis_maonibd.usuarioshoteles U INNER JOIN gomaonis_maonibd.hoteles H on H.IDHOTEL = U.IDHOTEL INNER JOIN gomaonis_maonibd.empresas E on E.IDEMPRESA = H.IDEMPRESA WHERE U.IDUSUARIO =  '" + req.params.IDUSUARIO + "'"; 
  
  
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query HotelesByUsuario")
                conn.query (sentencia, callback);
                    
            },
            function(resp, cb) 
            {
               conn.release();
                //callback (null, JSON.stringify (resp));
                //res.send(JSON.stringify (resp));
                res.send(resp); //JSON a saco!
                
               
            }
        ], callback);
    }, callback);   
}

exports.Origen =  function  (req, res,callback)
{    
    var sentencia = "SELECT * FROM gomaonis_maonibd.ORIGEN order by IDORIGEN"; 

    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                conn.query (sentencia, callback);
                    
            },
            function(resp, cb) 
            {
               conn.release();
                res.send(resp);
            }
        ], callback);
    }, callback);   
}

exports.IncidenciasNoNotificadas =  function  (req, res,callback)
{
    utilities.logFile("GET IncidenciasNoNotificadas");
    
    var sentencia = "select * from INCIDENCIAS_NO_NOTIFICADAS";
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                conn.query (sentencia, callback);                    
            },
            function(resp, cb) 
            {
               conn.release();
                res.send(resp);
            }
        ], callback);
    }, callback);   
}

exports.topResolutivos =  function  (req, res,callback)
{
    utilities.logFile("GET topResolutivos");
    
    var sentencia = "call TOP_RESOLUTIVOS (?, ?)"; 
    
    box.connect(function(conn, callback)
    {
        cps.seq([
            function(_, callback)
            {
                console.log("query TOP_RESOLUTIVOS")
                conn.query (sentencia,  [req.params.IDEMPRESA, req.params.ANYO], callback);                    
            },
            function(resp, cb) 
            {
                conn.release();
                res.send(resp[0]); 
            }
        ], callback);
    }, callback);   
}