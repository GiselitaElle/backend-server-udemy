var express =  require('express');

var bcrypt = require('bcryptjs');

var app = express();

var jwt = require('jsonwebtoken');

//var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

var mdAutenticacion = require('../middleware/autenticaion');



/*=============================================
Obtener todos los usuarios
=============================================*/
app.get('/', (req, res, next)  => {

	Usuario.find({ }, 'nombre email img role')
		.exec(

			( err, usuarios )=>{
			err=>{
				return res.status(500).json({
					ok: false,
					mensaje: 'ERROR cargando usuarios',
				errors: err
				});
			}

			res.status(200).json({
			ok: true,
			usuarios: usuarios
			});
		});
});




/*=============================================
Actualizar  usuario
=============================================*/

app.put('/:id',mdAutenticacion.verificaToken, (req, res) =>{

	var id = req.params.id;
	var body = req.body;

	Usuario.findById( id, ( err, usuario ) => {
		if(err){
				return res.status(500).json({
					ok: false,
					mensaje: 'ERROR al buscar usuraio',
					errors: err
				});
			}
		if ( !usuario ){
			return res.status(400).json({
					ok: false,
					mensaje: 'El usuario con el id '+ id + ' no existe',
					errors: {message: 'No existe el usuario con ese ID'}
				});
		}
		
		usuario.nombre = body.nombre;
		usuario.email = body.email;
		usuario.role = body.role;

		usuario.save( ( err, usuarioGuardado) =>{
			if(err){
				return res.status(400).json({
					ok: false,
					mensaje: 'ERROR al actualizar usuraio',
					errors: err
				});
			}

			usuarioGuardado.password = ' :) ';

			res.status(200).json({
				ok: true,
				usuario: usuarioGuardado,
				usuraiotoken: req.usuario
			});
		});
	});

});

/*=============================================
Crear un nuevo usuarios
=============================================*/
app.post('/', mdAutenticacion.verificaToken, (req, res)=>{

	var body = req.body;

	var usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		img: body.imag,
		role: body.role
	});

	usuario.save( ( err, usuarioGuardado ) =>{
		if(err){
				return res.status(400).json({
					ok: false,
					mensaje: 'ERROR crear usuario',
					errors: err
				});
			}
		usuarioGuardado.password = ' :) ';

		res.status(201).json({
			ok: true,
			usuario: usuarioGuardado,
			usuraiotoken: req.usuario
		});
	});
});

/*=============================================
 Eliminar  usuario
=============================================*/
app.delete('/:id',mdAutenticacion.verificaToken, (req, res) =>{

	var id = req.params.id;

	Usuario.findByIdAndRemove(id, ( err, usuarioBorrado ) => {
		if(err){
			return res.status(500).json({
				ok: false,
				mensaje: 'ERROR al borrar usuario',
				errors: err
			});
		}
		if( !usuarioBorrado ){
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe un usuario con ese ID',
				errors: {message: 'No existe el usuario con ese ID'}
			});
		}
		res.status(200).json({
			ok: true,
			usuario: usuarioBorrado,
			usuraiotoken: req.usuario
		});
	});
});



module.exports = app;