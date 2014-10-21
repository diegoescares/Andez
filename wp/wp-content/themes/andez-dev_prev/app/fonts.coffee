

checkwidth_prev = false


app.fonts =

	init: ->

		app.fonts.tools.init()
		app.fonts.presentation()
		app.fonts.nav.init()

		app.fonts.instructions.init()


	add: (font,font_id) ->

		if !$("head").find('link[data-font-id="'+font_id+'"]').length
			$("head").append '<link href="'+$("body").attr("data-url")+'/wp-content/fonts/'+font_id+'/font.css" rel="stylesheet" type="text/css" data-font="'+font_id+'" />'


	loadFont: (fontdiv,callback=false) ->
		font    = fontdiv.attr("data-font")
		font_id    = fontdiv.attr("data-font-id")
		app.fonts.add font, font_id
		fontdiv.css
			"font-family": font
		fontdiv.find("div,input").css
			"font-family": font
		console.log "--- Fuente puesta"
		app.fonts.checkFont(fontdiv,font)


	searchLoadFont: ->
		foundfont = $(".font:not(.font-loaded)").eq(0)
		console.log "*-- Fuente a cargar: "+ foundfont.attr("data-font")
		if foundfont.length
			app.fonts.loadFont foundfont, app.fonts.searchLoadFont


	checkFont: (fontdiv,font) ->
		$(".checkloadfont").remove()
		$("body").append("<span class='checkloadfont' style='position:absolute;top:-100px;left:0;background:#999;font-family:serif;'>abcijl!$%&/o0</span>")
		checkwidth_prev = false
		app.fonts.checkFontT(fontdiv,font)

	checkFontT: (fontdiv,font) ->

		console.log "checkeando"

		checkdiv = $(".checkloadfont")
		checkwidth = checkdiv.width()

		$(".checkloadfont").css
			"font-family": font

		console.log checkwidth + " vs " + checkwidth_prev

		if checkwidth!=checkwidth_prev && checkwidth_prev!=false
			fontdiv.addClass('font-loaded')
			console.log "--- Fuente cargada"
			app.fonts.searchLoadFont()
		else
			console.log "dsadsa"
			setTimeout ->
				app.fonts.checkFontT(fontdiv,font)
			,50

		checkwidth_prev = checkwidth






	nav:
		init: ->
			$(".single-font-navigation .nav").unbind("click").bind "click", ->
				app.fonts.nav.load $(this)
				false

		load: (element) ->

			url = element.attr("href").split(' ').join('%20');

			dir = false
			dir = "right" if element.hasClass("nav-right")
			dir = "left"  if element.hasClass("nav-left")

			console.log url

			$(".single-font-header").removeClass "animation-right"
			$(".single-font-header").removeClass "animation-left"

			$(".single-font-header").addClass "animation-right-out" if dir=="left"
			$(".single-font-header").addClass "animation-left-out"  if dir=="right"

			$(".test-font").addClass "out"

			setTimeout ->
				$(".single-font-header").load url+" .single-font-header>", ->
					$(".single-font-header").removeClass "animation-right-out"
					$(".single-font-header").removeClass "animation-left-out" 
					$(".single-font-header").addClass "animation-"+dir

					newfont = $("h1").attr("data-font")
					newfont_id = $("h1").attr("data-font-id")

					if newfont_id

						$(".test-font").attr "data-font", newfont
						$(".test-font-h1, .test-font-p").css
							"font-family": newfont

						$(".test-font").removeClass("out").addClass "in"

						app.fonts.add newfont, newfont_id
						app.fonts.tools.textareaheight()
						setTimeout ->
							app.fonts.tools.textareaheight()
						,1000

						app.fonts.nav.init()
						app.actions.init()
			,500


	presentation: ->

		texts_default = [
			"Lorem ipsum dolor sit amet",
			"Repellendus, inventore, nemo.",
			"423-89(08)*2+83591",
			"Doloremque placeat cupiditate",
			"Amet quod sint adipisci.",
			"$%&*=?{+",
			"Itaque nihil officiis."
			"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
		]

		$(".hola-bg").each ->
			div = $(this)
			texts = div.attr("data-texts")
			if texts
				texts = texts.split("||")
			else
				texts = texts_default

			console.log texts
			rand = Math.floor((Math.random() * 10) + 1)

			i = 1
			for text in texts
				rand_size = Math.floor((Math.random() * 150) + 1)
				rand_top = i*10
				div.append "<div class='chao chao-"+i+"' style='font-size:"+rand_size+"px;top:"+rand_top+"%;'>"+text+"</div>"
				i++

			# Insert font
			font = div.attr("data-font")
			app.fonts.add font
			div.css
				"font-family": font


		app.fonts.searchLoadFont()


		$(".font-big").keyup ->
			text = $(this).val()
			$(".font-big").each ->
				if !$(this).is(":focus")
					$(this).val text


	instructions:
		init: ->
			$(".instruction").each ->
				inst = $(this) 
				n = inst.attr("data-instruction")

				if !app.cookie.read "instruction-"+n

					inst.addClass("in")
					console.log inst.parent().find("input,textarea")
					inst.parent().find("input,textarea").keyup ->
						setTimeout ->
							inst.addClass("out")
							app.cookie.create "instruction-"+n, "ok"
							setTimeout ->
								inst.remove()
							,500
						,500




	tools:
	
		init: ->

			# Height test
			$("#test-font-container").css
				"min-height": $(window).height() - $("header").height()
			$(window).resize ->
				$("#test-font-container").css
					"min-height": $(window).height() - $("header").height()


			# Set font

			font = $(".test-font").attr("data-font")
			font_id = $(".test-font").attr("data-font-id")
			
			app.fonts.add font, font_id
			$(".test-font-h1, .test-font-p").css
				"font-family": font

			# Events test

			app.fonts.tools.textareacopytext()
			$(".test-font-h1.live, .test-font-p.live").keyup ->
				app.fonts.tools.textareacopytext()

			$("body").click ->
				$(".test-font-group").removeClass "in"
				$(".tools").addClass "out"
				setTimeout ->
					$(".tools").removeClass "in out"
					$(".tools-group").removeClass "in"
				,500


			$(".tools").click (e) ->
				e.stopPropagation()
			$(".test-font-h1.live, .test-font-p.live").click (e) ->
				e.stopPropagation()

			$(".test-font-h1.live, .test-font-p.live").focus ->

				$(".tools").addClass "in"

				$(".test-font-group").removeClass "in"
				$(".tools-group").removeClass "in"

				test_group = $(this).closest(".test-font-group")
				test_group.addClass "in"
				$(".tools-group."+test_group.attr("data-tools")).addClass "in"
	
			setTimeout ->
				app.fonts.tools.textareaheight()
			,1000

			$(window).resize ->
				app.fonts.tools.textareaheight()



			# Set css

			$(".tool").each ->
				tool        = $(this)
				tool_to     = tool.attr("data-to")
				tool_css    = tool.attr("data-css")
				tool_init   = tool.attr("data-init")
				tool_select = tool.attr("data-select")

				# Set properties from cookie

				if app.cookie.read "color"
					$(".tool[data-css='color']").attr "data-init", app.cookie.read("color")
				if app.cookie.read "background-color"
					$(".tool[data-css='background-color']").attr "data-init", app.cookie.read("background-color")


				# Set css
				app.fonts.tools.insertcss(tool_to,tool_css,tool_init)

				# Set indicator
				app.fonts.tools.setindicator($(this),tool_init)

				# Set options for colors
				if tool_select
					tool_select_split = tool_select.split("|")
					tool.find(".tool-icon-color-inner").css
						'background-color': '#'+tool_init
					$.each tool_select_split, (k,tool_option) ->
						tool.find(".tool-select").append("<div class='tool-option' data-value='"+tool_option+"' style='background-color:#"+tool_option+";'><div class='tool-option-selected'></div></div>")


			# Events move bar

			click_active = false

			$(".tool .tool-bar").mousedown (e) ->
				app.fonts.tools.movebar($(this),e)
				click_active = true

			$(".tool .tool-bar").mouseup ->
				click_active = false

			$(".tool .tool-bar").mousemove (e) ->
				if click_active		
					app.fonts.tools.movebar($(this),e)


			# Events switch
			$(".tool[data-switch]").click ->
				tool     = $(this)
				tool_to  = tool.attr("data-to")
				tool_css = tool.attr("data-css")

				values = tool.attr("data-switch").split("|")
				value1 = values[0]
				value2 = values[1]

				tool.toggleClass("on")
				
				if tool.hasClass("on")
					app.fonts.tools.insertcss(tool_to,tool_css,value1)
				else
					app.fonts.tools.insertcss(tool_to,tool_css,value2)


			# Colores
			app.fonts.tools.colors.init()


		setindicator: (tool,value) ->

			tool_min = parseInt tool.attr("data-min")
			tool_max = parseInt tool.attr("data-max")

			if tool_max
	
				move = parseInt( ( value * 100 / (tool_max-tool_min) ) - ( tool_min * 100 / (tool_max-tool_min) ) )

				#invert
				move = 100 - move

				tool.find(".tool-indicator").css
					top: move + "%"



		movebar: (element,e) ->

			pos       = element.offset().top
			click     = e.pageY
			scroll    = $(window).scrollTop()
			height    = element.height()
			top       = pos - scroll
			click_bar = click - pos
			move      = click_bar * 100 / height

			element.find(".tool-indicator").css
				top: move + "%"

			tool = element.closest(".tool")
			tool_to = tool.attr("data-to")
			tool_css = tool.attr("data-css")
			tool_min = parseInt tool.attr("data-min")
			tool_max = parseInt tool.attr("data-max")

			tool_calculate = parseInt( (tool_max-tool_min) * move / 100 ) + tool_min

			#invert
			tool_calculate = tool_max - tool_calculate + tool_min

			console.log tool_calculate+"px"

			app.fonts.tools.insertcss(tool_to,tool_css,tool_calculate)




		insertcss: (to,css,value) ->
			if css == "font-size"
				$(to).css "font-size": value+"px"
			if css == "line-height"
				$(to).css "line-height": value+"px"
			if css == "letter-spacing"
				$(to).css "letter-spacing": value+"px"
			if css == "word-spacing"
				$(to).css "word-spacing": value+"px"

			if css == "text-transform"
				$(to).css "text-transform": value
			if css == "font-weight"
				$(to).css "font-weight": value

			if css == "color"
				$(to).css "color": "#"+value
				app.cookie.create "color", value
			if css == "background-color"
				$(to).css "background-color": "#"+value
				app.cookie.create "background-color", value

			app.fonts.tools.textareaheight()


		textareaheight: ->

			height_h1 = $(".test-font-h1.ghost").height()
			$(".test-font-h1.live").css
				height: height_h1+"px"
			$(".test-font-h1.live").parent().find(".test-font-group-focus").css
				height: height_h1+"px"

			height_p = $(".test-font-p.ghost").height()
			$(".test-font-p.live").css
				height: height_p+"px"
			$(".test-font-p.live").parent().find(".test-font-group-focus").css
				height: height_p+"px"


		textareacopytext: ->

			$(".test-font-h1.ghost").html $(".test-font-h1.live").val()
			$(".test-font-p.ghost").html $(".test-font-p.live").val()
			app.fonts.tools.textareaheight()



		colors:
			init: ->
				$(".tools .tool-select .tool-option").click ->
					option     = $(this)
					tool       = option.closest(".tool")
					tool_to    = tool.attr("data-to")
					tool_css   = tool.attr("data-css")
					tool_value = option.attr("data-value")
					app.fonts.tools.insertcss(tool_to,tool_css,tool_value)

					tool.find(".tool-select .tool-option").removeClass("in")

					tool.find(".tool-icon-color-inner").css
						'background-color': '#'+tool_value 

					option.addClass("in")






