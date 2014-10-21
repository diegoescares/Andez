

app.actions =

	init: ->

		$("[data-goto]").click ->
			goto = $(this).attr("data-goto")
			to   = $(goto).offset().top
			console.log to
			$("html,body,.secretmenu-container-front").animate
				scrollTop: to
			
			if goto == "#test-font-container"
				setTimeout ->
					$(".test-font-h1.live").focus()
				,500

			false

