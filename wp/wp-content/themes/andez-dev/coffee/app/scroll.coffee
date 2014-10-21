

app.scroll = ->

	if !app.isMobile()
		scroll_prev = 0
		$(window).scroll ->

			# Esconder header
			scroll = $(window).scrollTop()
			height_window = $(window).height()
			height_body = $("body").height()

			if scroll > 50
				$("header").addClass "header-hide"
			else
				$("header").removeClass "header-hide"

			if scroll > 70
				$(".single-font-header").addClass("fixed")
			else
				$(".single-font-header").removeClass("fixed")


			scroll_prev = scroll


			# Mostrar en scroll

			if $(".displayscroll").length
				$(".displayscroll").each ->
					element = $(this)
					element_top = element.offset().top
					element_height = element.height()
					if scroll + height_window > element_height + element_top
						element.addClass "in"

