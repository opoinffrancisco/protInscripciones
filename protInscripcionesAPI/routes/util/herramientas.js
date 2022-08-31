// herramientas


	const paginate = (items, per) =>
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
		

module.exports = {
    paginate,
	nextPage
};