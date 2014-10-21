

app.actions =

	init: ->

		$("[data-goto]").click ->
			goto = $(this).attr("data-goto")
			to   = $(goto).offset().top - $("header").height()
			
			if goto == "#test-font-container"
				to = to + 12
				setTimeout ->
					$(".test-font-h1.live").focus()
				,500

			$("html,body,.secretmenu-container-front").animate
				scrollTop: to

			false

