// herramientas


	const paginar = (items, per) =>
	Array .from ({length: Math .ceil (items / per)}, (_, i) => ({
	  page: i + 1,
	  offset: i * per,
	  range: [i * per + 1, Math .min ((i + 1) * per, items)],
	  total: Math .min ((i + 1) * per, items) - (i * per)
	}))

	const nextPage = (
		items = [], per = 10, page = 1, top = Math .min ((page + 1) * per, items)
	) => ({
		page,
		range: [page * per + 1, top],
		total:  Math .max (0, top - (page * per)),
		done: top >= items
	})
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
	console .log (`....`)               // `done` stays false
	console .log (nextPage (total_contenido, req.body.por_pagina, 11)) //  ...
	console .log (nextPage (total_contenido, req.body.por_pagina, 12)) // `done` is now true 
  	*/

	
	function primeraMayuscula(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

module.exports = {
	primeraMayuscula,
    paginar,
	nextPage
};