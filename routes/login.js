var express =  require('express');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');



app.post('/', ( req, res) =>{

	var body = req.body;

	//En el modelo buscara el email ya que este debe ser unico
	Usuario.findOne({ email: body.email }, (err, usuarioBD)=> {

		//Si hay un error en la busqueda arroja un mensaje y termina la solicitud
		if(err){
			return res.status(500).json({
					ok: false,
				mensaje: 'ERROR al buscar usuario',
				errors: err
			});
		}

		//comprueba si existe el email en la BD
		if( !usuarioBD ){
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales ioncorrectas - email',
				errors: err
			});
		}

		//Verifica si la contraseña es correcta
		if( !bcrypt.compareSync( body.password, usuarioBD.password ) ){
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales ioncorrectas - password',
				errors: err
			});
		}

		//Crear token!!
		usuarioBD.password = ' :) ';
		var token = jwt.sign({ usuario:usuarioBD }, SEED, { expiresIn: 14400 });

		res.status(200).json({
			ok: true,
			mensage: 'Login post correcto',
			usuario: usuarioBD,
			token: token,
			id: usuarioBD._id
		});

	});

});

module.exports = app;