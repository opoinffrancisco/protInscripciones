var express = require(`express`);
var router = express.Router();
var nodemailer = require(`nodemailer`);
var bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const uuid = require(`uuid`);

var DBCONEXION = require(`../mod/conexion`);
var USUARIOS = require(`../mod/usuarios`);
var V = require(`./util/validaciones`);
var H = require(`./util/herramientas`);
var M = require(`./util/mensajes`);

const txtEntidad = `usuario`;
const datosEmail = {
	user: `soporte.opoinf@gmail.com`,
	pass: `xduvlgasasyyblzx`
};

router.get(`/`,  async (req, res) => {
  
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const usuarios = await USUARIOS.getAll(conexion_db, req.body);
	if (usuarios===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorEnBusquedas} ${txtEntidad}s` });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data : usuarios
	});
  
});

router.get(`/:id`,  async (req, res) => {

	if (!req.params.id) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.faltaID}` });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const usuario = await USUARIOS.get(conexion_db, { id: req.params.id });
	if (usuario===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorAlBuscar} ${txtEntidad}` });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: usuario
	});
  
});

router.post(`/iniciar-sesion`, async (req, res) => {
	
	console.log(req.body, req.params, req.body)
	// Validaciones
	const { error } = V.schemaLogin.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const resultado = await USUARIOS.verificarExistencia(conexion_db, req.body);
	if (resultado===false) return res.status(400).json({ error: true, mensajes: `${H.primeraMayuscula(txtEntidad)} ${M.txtGenericos.errorNoEncontrado}` });
	const usuario = resultado[0];

	const validacioncontrasena = await bcrypt.compare(req.body.contrasena, usuario.contrasena);
	if (!validacioncontrasena) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorContrasenaIncorrecta}` })
		
	DBCONEXION.cerrar_conexion(conexion_db);


	// Crear token
	const token = jwt.sign({
		email: usuario.email,
		username: usuario.username,
		id: usuario.id
	}, process.env.TOKEN_SECRET)

	res.header(`auth-token`, token).json({
		error: false,
		data: {
			token : token,
			usuario : usuario
		},
	});
});

router.post(`/registrar`,   async (req, res) => {

	// Validaciones
	console.log(req.body, req.query, req.params)
	const { error } = V.schemaUsuario.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const verificarExistencia = await USUARIOS.verificarExistencia(conexion_db, req.body);
	if (verificarExistencia!=false || verificarExistencia.length>0 ) return res.status(400).json({ error: true, mensaje: `${M.txtGenericos.errorYaExiste} ${txtEntidad}` });


    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena = await bcrypt.hash(req.body.contrasena, salt);
	const usuario = {
        username: req.body.username,
        email: req.body.email,
        contrasena: contrasena
    };
	const nuevoRegistro = await USUARIOS.crear(conexion_db, usuario);
	if (nuevoRegistro===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorRegistro}` });	

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		mensaje : ` ${M.txtGenericos.registroCorrecto} `,
		resultado : nuevoRegistro
	});
	
	
});

router.put(`/editar`,  async (req, res) => {
	// Validaciones
	const { error } = V.schemaUsuario.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const verificarExistencia = await USUARIOS.get(conexion_db, req.body);
	if (verificarExistencia===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorNoExiste} ${txtEntidad}` });

	const registroEditado = await USUARIOS.editar(conexion_db, req.body);
	if (registroEditado===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorEdicion}` });	

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		mensaje : ` ${M.txtGenericos.edicionCorrecta} `,
		resultado : registroEditado
	});
});

router.post(`/recuperar-contrasena`,  async (req, res) => {
	// Validaciones
	console.log(req.body);
	const { error } = V.schemaRecuperarContrasena.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const verificarExistencia = await USUARIOS.verificarExistencia(conexion_db, req.body);
	if (verificarExistencia===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorNoExiste} ${txtEntidad}` });

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
	if (edicionRealizada===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorModificarContrasena}` });


	var transporter = nodemailer.createTransport({
		service: `gmail`,
		auth: {
			user: `${datosEmail.user}`,
			pass: `${datosEmail.pass}`

		}
	});

	var mailOptions = {
		from: `${M.txtGenericos.nombreRemitente} <${datosEmail.user}>`,
		to: req.body.email,
		subject: `${M.txtGenericos.asuntoEmailRecuperacionContrasena}`,
		text: ` Hola ${verificarExistencia[0].username}, \n` +
		`		su nueva contraseña es: ${nuevaContrasena}  \n`
	}; 
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		console.log(error);
		res.json({
					error : true,
					error_m : error,
					message : `${M.txtGenericos.errorEnviarMensaje}`
				});									    
		} else {
		res.json({
					error : false,
					message : `${M.txtGenericos.contrasenaEnviada} `,
					datos : info.response
				});										
		}
	});
});

router.put(`/borrado-logico`,  async (req, res) => {

	if (!req.body.id) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.faltaID}` });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const eliminacion = await USUARIOS.borradoLogico(conexion_db, { id: req.body.id });
	if (eliminacion===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorBorradoPermanentemente} ${txtEntidad}` });

	DBCONEXION.cerrar_conexion(conexion_db);
	
	res.json({
		error : false,
		data: `${H.primeraMayuscula(txtEntidad)} ${M.txtGenericos.borradoPermanentemente}`
	});
});

router.post(`/borrado-permanente`,  async (req, res) => {

	if (!req.body.id) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.faltaID}` });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	const eliminacion = await USUARIOS.borradoPermanente(conexion_db, { id: req.body.id });
	if (eliminacion===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorBorradoPermanentemente} ${txtEntidad}` });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: `${H.primeraMayuscula(txtEntidad)} ${M.txtGenericos.borradoPermanentemente}`
	});
});

module.exports = router;
