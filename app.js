//Requires: Importacion de librerias de terceros para que cargue nuestra app
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//Importar rutas
var appRoutes = require('./routes/appRoutes');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');




//Inicializar variables
var app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err , res )=>{
	if( err ) throw err;

	console.log('Base de datos: \x1b[32m%s\x1b[0m','online');

});


//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//Escuchar peticiones
app.listen(3000, () =>{
	console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m','online');
});