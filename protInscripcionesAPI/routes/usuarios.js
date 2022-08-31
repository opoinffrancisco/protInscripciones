var express = require('express');
var router = express.Router();
var DBCONEXION = require('../mod/conexion');
var USUARIOS = require('../mod/usuarios');
var VALIDACIONES = require('./util/validaciones');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require("uuid");


router.get('/',  async (req, res) => {
  
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const usuarios = await USUARIOS.getAll(conexion_db, req.body);
	if (usuarios===false) return res.status(400).json({ error: true, mensajes: 'Error al buscar usuarios' });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data : usuarios
	});
  
});

router.get('/:id',  async (req, res) => {

	if (!req.params.id) return res.status(400).json({ error: true, mensajes: 'Debe indicar el ID' });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const usuario = await USUARIOS.get(conexion_db, { id: req.params.id });
	if (usuario===false) return res.status(400).json({ error: true, mensajes: 'Error al buscar el usuario' });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: usuario
	});
  
});

router.post('/iniciar-sesion', async (req, res) => {
	
	console.log(req.body, req.params, req.body)
	// Validaciones
	const { error } = VALIDACIONES.schemaLogin.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const resultado = await USUARIOS.verificarExistencia(conexion_db, req.body);
	if (resultado===false) return res.status(400).json({ error: true, mensajes: 'Usuario no encontrado' });
	const usuario = resultado[0];

	const validacioncontrasena = await bcrypt.compare(req.body.contrasena, usuario.contrasena);
	if (!validacioncontrasena) return res.status(400).json({ error: true, mensajes: 'contraseña incorrecta' })
		
	DBCONEXION.cerrar_conexion(conexion_db);


	// Crear token
	const token = jwt.sign({
		email: usuario.email,
		username: usuario.username,
		id: usuario.id
	}, process.env.TOKEN_SECRET)

	res.header('auth-token', token).json({
		error: false,
		data: {
			token : token,
			usuario : usuario
		},
	});
});

router.post('/registrar',   async (req, res) => {

	// Validaciones
	console.log(req.body, req.query, req.params)
	const { error } = VALIDACIONES.schemaUsuario.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const verificarExistencia = await USUARIOS.verificarExistencia(conexion_db, req.body);
	if (verificarExistencia!=false || verificarExistencia.length>0 ) return res.status(400).json({ error: true, mensaje: 'El usuario ya ha sido registrado' });


    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena = await bcrypt.hash(req.body.contrasena, salt);
	const usuario = {
        username: req.body.username,
        email: req.body.email,
        contrasena: contrasena
    };
	const registroNuevo = await USUARIOS.crear(conexion_db, usuario);
	if (registroNuevo===false) return res.status(400).json({ error: true, error: 'No se pudo realizar el registro ' });	

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		mensaje : " Registro realizado correctamente ",
		resultado : registroNuevo
	});
	
	
});

router.put('/editar',  async (req, res) => {
	// Validaciones
	const { error } = VALIDACIONES.schemaUsuario.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const verificarExistencia = await USUARIOS.get(conexion_db, req.body);
	if (verificarExistencia===false) return res.status(400).json({ error: true, error: 'El usuario no existe' });

	const registroEditado = await USUARIOS.editar(conexion_db, req.body);
	if (registroEditado===false) return res.status(400).json({ error: true, error: 'No se pudo realizar la edición ' });	

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		mensaje : " Edición realizada correctamente ",
		resultado : registroEditado
	});
});

router.post('/recuperar-contrasena',  async (req, res) => {
	// Validaciones
	console.log(req.body);
	const { error } = VALIDACIONES.schemaRecuperarContrasena.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const verificarExistencia = await USUARIOS.verificarExistencia(conexion_db, req.body);
	if (verificarExistencia===false) return res.status(400).json({ error: true, error: 'El usuario no existe' });

	console.log(verificarExistencia[0])
	//DBCONEXION.cerrar_conexion(conexion_db);



	const nuevaContrasena = uuid.v1();
    const salt = await bcrypt.genSalt(10);
    const contrasena = await bcrypt.hash(nuevaContrasena, salt);


	const edicionRealizada = await USUARIOS.editar(conexion_db, {
		id: verificarExistencia[0].id,
		email: verificarExistencia[0].email,
		username: verificarExistencia[0].username,
		contrasena: contrasena,
	});
	if (edicionRealizada===false) return res.status(400).json({ error: true, error: 'Error al modificar la contraseña.' });


	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'soporte.opoinf@gmail.com',
			pass: 'xduvlgasasyyblzx'

		}
	});

	var mailOptions = {
		from: '"SOPORTE APP MOVIL" <soporte.opoinf@gmail.com>',
		to: req.body.email,
		subject: 'SOPORTE APP MOVIL: Recuperación de contraseña',
		text: ' Hola '+verificarExistencia[0].username+', \n' +
			'		su nueva contraseña es: '+nuevaContrasena+'  \n'
	}; 
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		console.log(error);
		res.json({
					error : true,
					error_m : error,
					message : "No se ha podido enviar el correo."
				});									    
		} else {
		res.json({
					error : false,
					message : "La nueva contraseña ha sido enviada al correo electrónico "+req.body.email+", revísala y utilízala. ",
					datos : info.response
				});										
		}
	});
});

router.put('/borrado-logico',  async (req, res) => {

	if (!req.body.id) return res.status(400).json({ error: true, mensajes: 'Debe indicar el ID' });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const eliminacionUsuario = await USUARIOS.borradoLogico(conexion_db, { id: req.body.id });
	if (eliminacionUsuario===false) return res.status(400).json({ error: true, mensajes: 'No se pudo borrar permanentemente el usuario' });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: "Usuario fue borrado permanentemente"
	});
});

router.post('/borrado-permanente',  async (req, res) => {

	if (!req.body.id) return res.status(400).json({ error: true, mensajes: 'Debe indicar el ID' });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const eliminacionUsuario = await USUARIOS.borradoPermanente(conexion_db, { id: req.body.id });
	if (eliminacionUsuario===false) return res.status(400).json({ error: true, mensajes: 'No se pudo borrar permanentemente el usuario' });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: "Usuario fue borrado permanentemente"
	});
});

module.exports = router;
