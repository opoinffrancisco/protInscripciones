var express = require('express');
var router = express.Router();
var DBCONEXION = require('../mod/conexion');
var ANUNCIOS = require('../mod/anuncios');
var VALIDACIONES = require('./util/validaciones');
var HERRAMIENTAS = require('./util/herramientas');
var bcrypt = require('bcrypt');


router.post('/',  async (req, res) => {
  
	console.log(req.body)


	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const resCount = await ANUNCIOS.getCountAll(conexion_db, req.body);
	if (resCount===false) return res.status(400).json({ error: true, mensajes: 'Error al contar total de registros' });

	const resultados = await ANUNCIOS.getAll(conexion_db, {por_pagina: req.body.por_pagina, siguiente: (req.body.pagina - 1) * req.body.por_pagina} );
	if (resultados===false) return res.status(400).json({ error: true, mensajes: 'Error al buscar' });

	DBCONEXION.cerrar_conexion(conexion_db);

	let total_contenido 	= resCount[0].total;

	
  
	console .log (
		"total_paginas: "+ HERRAMIENTAS.paginate(total_contenido, req.body.por_pagina).length
	); 


	/*
	const nextPage = (
		items = [], per = 10, page = 1, top = Math .min ((page + 1) * per, items)
	) => ({
		page,
		range: [page * per + 1, top],
		total:  Math .max (0, top - (page * per)),
		done: top >= items
	})
						
	console .log (nextPage (total_contenido, req.body.por_pagina, 1))  // `done` is false
	console .log (nextPage (total_contenido, req.body.por_pagina, 2))  //  ...
	console .log (nextPage (total_contenido, req.body.por_pagina, 3))  //  ...
	console .log ('....')               // `done` stays false
	console .log (nextPage (total_contenido, req.body.por_pagina, 11)) //  ...
	console .log (nextPage (total_contenido, req.body.por_pagina, 12)) // `done` is now true 
  	*/

  	let total_paginas = HERRAMIENTAS.paginate(total_contenido, req.body.por_pagina).length;

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

router.get('/:id',  async (req, res) => {

	if (!req.params.id) return res.status(400).json({ error: true, mensajes: 'Debe indicar el ID' });

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const usuario = await ANUNCIOS.get(conexion_db, { id: req.params.id });
	if (usuario===false) return res.status(400).json({ error: true, mensajes: 'Error al buscar el usuario' });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: usuario
	});
  
});

router.post('/registrar',   async (req, res) => {

	// Validaciones
	const { error } = VALIDACIONES.schemaAnuncios.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const registroNuevo = await ANUNCIOS.crear(conexion_db, {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
		usuario_id : req.usuario.id
    });
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
	const { error } = VALIDACIONES.schemaAnuncios.validate(req.body);
	if (error) return res.status(400).json({  error: true, mensajes: error.details[0].message })

	var conexion_db = await DBCONEXION.iniciar_conexion();
	if (!conexion_db) {
		return res.status(400).json({
			error: true,
			mensaje: "Error al comunicarse con la base de datos, comuniquese con el administrador"
		});
	}

	const registroEditado = await ANUNCIOS.editar(conexion_db, {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        id: req.body.id,
		usuario_id : req.usuario.id
    });
	if (registroEditado===false) return res.status(400).json({ error: true, error: 'No se pudo realizar la edición ' });	

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		mensaje : " Edición realizada correctamente ",
		resultado : registroEditado
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

	const eliminacionUsuario = await ANUNCIOS.borradoLogico(conexion_db, { id: req.body.id });
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

	const eliminacionUsuario = await ANUNCIOS.borradoPermanente(conexion_db, { id: req.body.id });
	if (eliminacionUsuario===false) return res.status(400).json({ error: true, mensajes: 'No se pudo borrar permanentemente el usuario' });

	DBCONEXION.cerrar_conexion(conexion_db);


	res.json({
		error : false,
		data: "Usuario fue borrado permanentemente"
	});
});

module.exports = router;
