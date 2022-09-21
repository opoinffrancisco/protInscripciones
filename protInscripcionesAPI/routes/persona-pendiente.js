/**
 *  PASOS BASE PARA CONFIGURAR EL ARCHIVO
 *	* Indicar modelo de conexion de la Entidad
 * 	* En la variable txtEntidad el nombre de la entidad
 * 	* API registrar: Ajustar validaciones
 * 	* API editar   : Ajustar validaciones
 * 
 */
var express = require(`express`);
var router = express.Router();

var DBCONEXION = require(`../mod/conexion`);
var PERSONA = require(`../mod/persona-pendiente`);
var V = require(`./util/validaciones`);
var H = require(`./util/herramientas`);
var M = require(`./util/mensajes`);

const txtEntidad = `Persona`;

/**
 * Parametros
 * @pagina {number}
 * @por_pagina {number}
 */
router.post(`/`,  async (req, res) => {
  
	// Validacion de datos
	const { error } = V.schemaPaginacion.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	// Iniciar conexion en la base de datos
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	// Gestiones
	const resCount = await PERSONA.getCountAll(conexion_db, req.body);
	if (resCount===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorContarRegistros}` });

	const resultados = await PERSONA.getAll(conexion_db, {por_pagina: req.body.por_pagina, siguiente: (req.body.pagina - 1) * req.body.por_pagina} );
	if (resultados===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorEnBusquedas}` });

	// Cerrar conexion de base de datos
	DBCONEXION.cerrar_conexion(conexion_db);
  
	// Enviar respuesta
	let total_contenido 	= resCount[0].total;
  	let total_paginas = H.paginar(total_contenido, req.body.por_pagina).length;
	console .log (`total_paginas: `+ H.paginar(total_contenido, req.body.por_pagina).length);
	res.json({
		"error" : false,
		"total_paginas": total_paginas,
		"data" : {
			"pagina": req.body.pagina,
			"siguiente_pagina": (req.body.pagina + 1),
			"por_pagina": req.body.por_pagina,//6
			"total": total_contenido,
			"total_paginas": total_paginas,
			"data": resultados 
		}
	});
});

/**
 * Parametros
 * @id {number}
 */
router.get(`/:id`,  async (req, res) => {

	// Validacion de datos
	if (!req.params.id) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.faltaID}` });

	// Iniciar conexion en la base de datos
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	// Gestiones
	const busqueda = await PERSONA.get(conexion_db, { id: req.params.id });
	if (busqueda===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorAlBuscar} ${txtEntidad}` });

	// Cerrar conexion de base de datos
	DBCONEXION.cerrar_conexion(conexion_db);

	// Enviar respuesta
	res.json({
		error : false,
		data: busqueda
	});
});

/**
 * Parametros a recibir
 * @id {number} : se pasara un 0 pero no se guardara
 * @nombre {string}
 * @apellido {string}
 * @dni {string}
 * @id_tipo_persona {number}
 * @id_salon_clase {number}
 * @id_usuario {number}
 */
router.post(`/registrar`,   async (req, res) => {

	// Validaciones
	const { error } = V.schemaPersona.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	// Iniciar conexion en la base de datos
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}
	
	// Gestiones
	const nuevoRegistro = await PERSONA.crear(conexion_db, req.body, req.usuario);
	if (nuevoRegistro===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorRegistro}` });	

	// Cerrar conexion de base de datos
	DBCONEXION.cerrar_conexion(conexion_db);

	// Enviar respuesta
	res.json({
		error : false,
		mensaje : `${M.txtGenericos.registroCorrecto}`,
		resultado : nuevoRegistro
	});	
});

/**
 * Parametros a recibir
 * @id {number} 
 * @nombre {string}
 * @apellido {string}
 * @dni {string}
 * @id_tipo_persona {number}
 * @id_salon_clase {number}
 */
router.put(`/editar`,  async (req, res) => {

	// Validaciones
	const { error } = V.schemaPersona.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	// Iniciar conexion en la base de datos
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	// Gestiones
	const registroEditado = await PERSONA.editar(conexion_db, req.body);
	if (registroEditado===false) return res.status(400).json({ error: true, error: `${M.txtGenericos.errorEdicion}` });	

	// Cerrar conexion de base de datos
	DBCONEXION.cerrar_conexion(conexion_db);

	// Enviar respuesta
	res.json({
		error : false,
		mensaje : `${M.txtGenericos.edicionCorrecta}`,
		resultado : registroEditado
	});
});

/**
 * Parametros
 * @id {number}
 */
router.put(`/borrado-logico`,  async (req, res) => {

	// Validacion de datos
	if (!req.body.id) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.faltaID}` });

	// Iniciar conexion en la base de datos
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}
	
	// Gestiones
	const eliminacion = await PERSONA.borradoLogico(conexion_db, { id: req.body.id });
	if (eliminacion===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorBorradoPermanentemente} ${txtEntidad}` });

	// Cerrar conexion de base de datos
	DBCONEXION.cerrar_conexion(conexion_db);

	// Enviar respuesta
	res.json({
		error : false,
		data: `${H.primeraMayuscula(txtEntidad)} ${M.txtGenericos.borradoPermanentemente}`
	});
});

/**
 * Parametros
 * @id {number}
 */
router.post(`/borrado-permanente`,  async (req, res) => {

	// Validacion de datos
	if (!req.body.id) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.faltaID}` });
	
	// Iniciar conexion en la base de datos
	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: `${M.txtGenericos.errorConexionDB}`
		});
	}

	// Gestiones
	const eliminacion = await PERSONA.borradoPermanente(conexion_db, { id: req.body.id });
	if (eliminacion===false) return res.status(400).json({ error: true, mensajes: `${M.txtGenericos.errorBorradoPermanentemente} ${txtEntidad}` });

	// Cerrar conexion de base de datos
	DBCONEXION.cerrar_conexion(conexion_db);

	// Enviar respuesta
	res.json({
		error : false,
		data: `${H.primeraMayuscula(txtEntidad)} ${M.txtGenericos.borradoPermanentemente}`
	});
});

module.exports = router;
