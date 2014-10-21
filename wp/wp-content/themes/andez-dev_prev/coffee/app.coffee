
$(document).ready ->
	app.init()

app =

	init: ->

		# Browsers
		#app.browsers()

		# Menú
		app.secretMenu.init()

		# Shares
		app.shares.init()

		# Tooltips
		app.tooltips()

		# Alertas
		app.alert.init()

		# Validación de formularios
		app.validation.form $("form.controls")

		# Loading
		app.loading.init()

		# Eventos en scroll
		app.scroll()

		# Plugins
		app.plugins.init()

		# Actions
		app.actions.init()

		# Fonts
		app.fonts.init()

#=include_tree app
