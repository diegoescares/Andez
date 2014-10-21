

app.plugins =

	init: ->


		# Isotope
		if $(".isotope").length
			isotope = $(".isotope").isotope()



	relayout: ->

		$("body").imagesLoaded ->
			app.alert.equidist()
			app.alert.equidist()
			if $(".isotope").length
				$(".isotope").isotope
					relayout: true


