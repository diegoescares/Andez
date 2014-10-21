<?php
/*
	$i=0;
	$dir   = get_bloginfo('template_url').'/fonts-andez';
	$files = scandir($dir);
	foreach($files as $file){
		if($file!="." && $file!=".." && $file!=".DS_Store"){
		if(file_exists($dir."/".$file."/font.css")){
		$fonts[$i] = $file;
		$i++;
	}}}
*/
?><!doctype html>
<html lang="en">
<head>

	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

	<title>{titulo}</title>
	<meta name="description" content="{descripcion}" />

	<!-- Meta tags facebook -->
	<meta property="og:image" content="{url imagen}"/>
	<meta property="og:title" content="{titulo}"/>
	<meta property="og:url" content="{url de la pagina}"/>
	<meta property="og:description" content="{description de la pagina}"/>

	<!-- Meta tags twitter cards -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="@loremipsum">
	<meta name="twitter:creator" content="@loremipsum">
	<meta name="twitter:title" content="{titulo}">
	<meta name="twitter:description" content="{descripcion}">
	<meta name="twitter:image:src" content="{url imagen}">
		
	<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
	<link href="<?php bloginfo('template_url') ?>/css/main.css" rel="stylesheet" />
	<link href="<?php bloginfo('template_url') ?>/fonts-andez/Hospital/font.css" rel="stylesheet" type="text/css" data-font="Hospital" />

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="<?php bloginfo('template_url') ?>/js/plugins.js"></script>
	<script src="<?php bloginfo('template_url') ?>/js/app.js"></script>

	
	<link href="<?php bloginfo('template_url') ?>/img/favicon.png" rel="shortcut icon" />
	
	<?php // wp_head(); ?>

	<!--[if lt IE 9]>
	<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->


</head>
<body data-url="<?php bloginfo('url') ?>">


<div id="container" class="secretmenu-container">

	<header class="secretmenu-translate">
		
		<div class="inner">


			<a href="<?php bloginfo('url'); ?>" id="logo">
				<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve">
				<g>
					<path fill="#FFFFFF" d="M74.608,54.024c0-7.15,0-12.619,0-18.002c0-11.288-9.988-18.242-26.829-18.242
						c-14.765,0-25.352,7.529-25.352,18.242c0,9.006,7.768,11.349,13.927,11.349c4.761,0,8.112-2.894,8.112-2.894
						s-1.325-0.846-1.325-2.535c0-1.693,2.103-3.35,4.994-3.35c2.798,0,4.718,1.43,4.718,4.085c0,1.504,0,5.506,0,5.506
						s-31.27-2.023-31.27,18.861c0,8.91,7.353,13.631,15.261,13.631c9.562,0,13.88-5.264,13.88-5.264l2.129-10.533l2.548,10.533
						c0,0,4.755,5.264,12.154,5.264c12.12,0,16.179-12.663,16.179-12.663S74.608,66.015,74.608,54.024z M52.853,58.319
						c0,0-1.88,1.9-4.295,1.9c-2.199,0-3.32-0.948-3.32-2.852c0-5.286,7.616-4.122,7.616-4.122V58.319z"/>
					<polygon fill="#FFFFFF" points="34.365,72.752 32.332,72.595 9.349,100 90.591,100 90.591,98.297 12.995,98.297 	"/>
					<polygon fill="#FFFFFF" points="60.997,32.542 62.614,33.297 90.651,0 11.172,0 11.172,1.703 86.831,1.703 	"/>
				</g>
				</svg>
			</a>



			<div class="secretmenu-button">
				<div class="secretmenu-button-bars">
					<div class="secretmenu-button-bar"></div>
					<div class="secretmenu-button-bar"></div>
					<div class="secretmenu-button-bar"></div>
				</div>
			</div>

			<div class="secretmenu-content">
				<ul>
					<li><a href="<?php bloginfo('url') ?>">Inicio</a></li>
					<li><a href="<?php bloginfo('url') ?>/tipografias/">Fuentes</a></li>
					<li><a href="<?php bloginfo('url') ?>/contacto/">Contacto</a></li>
					<li><a href="<?php bloginfo('url') ?>/tipografias-chilenas/">¿Qué es andez?</a></li>
				</ul>
			</div>

		</div>

	</header>

	<div class="secretmenu-container-back"></div>
	<div class="secretmenu-container-front">
		
		<div id="body">


