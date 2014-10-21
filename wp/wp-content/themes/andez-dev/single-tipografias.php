<?php get_header(); ?>

	<?php while ( have_posts() ) : the_post(); ?>

<?php

$font = get_the_title();
$font_id = $post->ID;

$le_postlist = get_posts("post_type=tipografias&order=ASC");
$le_posts = array();
foreach ($le_postlist as $le_posts_id) {
	$le_posts[] += $le_posts_id->ID;
}

$current = array_search($post->ID, $le_posts);
$prevID = $le_posts[$current-1];
$nextID = $le_posts[$current+1];

?>


<div class="single-font-header">
	<div class="limit">
			
		<div class="single-font-navigation">
			<div class="limit">
				<div class="navigation">
					<?php if (!empty($prevID)) { ?>
					<a href="<?php echo get_permalink($prevID) ?>" class="nav nav-right"><i class="fa fa-chevron-right"></i></a>
					<?php } ?>
					<?php if (!empty($nextID)) { ?>
					<a href="<?php echo get_permalink($nextID) ?>" class="nav nav-left"><i class="fa fa-chevron-left"></i></a>
					<?php } ?>
				</div>
				<h1 class="single-font-title" data-font="<?php echo $font ?>" data-font-id="<?php echo $font_id ?>"><?php the_title() ?></h1>
			</div>
		</div>
		<div class="single-font-navigation-ghost"></div>


		<div class="inner">

			<a class="single-font-author" href="<?php echo get_author_posts_url(get_the_author_id()) ?>">
				<img src="http://placehold.it/100x100" alt="Placeholder" class="alignleft" />
				<?php the_author() ?>
			</a>
			
			<div class="single-font-description">
				<?php the_content() ?>
				<!--<a href="#">Saber más...</a>-->
			</div>
			
			<!--<div class="single-font-content hide" style="display:none">
				<div class="single-font-features">
					<ul>
						<li class="not">Extra Light <div class="line"></div></li>
						<li class="not">Light <div class="line"></div></li>
						<li class="not">Book <div class="line"></div></li>
						<li>Normal</li>
						<li>Medium</li>
						<li class="not">Semibold <div class="line"></div></li>
						<li>Bold</li>
						<li>Black</li>
						<li class="not">Extra Black <div class="line"></div></li>
					</ul>					
				</div>
			</div>-->

			<div class="single-font-buttons">
				<a href="#" class="button button-medium button-light" data-goto="#test-font-container">Probar</a>
				<a href="<?php $file = get_field('download'); echo $file["url"]; ?>" class="button button-medium button-light"><i class="fa fa-arrow-down pull-left"></i> Descargar fuente</a>
			</div>

		</div>
	</div>	
</div>
	


<div class="single-font-body">
	

	<div id="test-font-container">
		<div class="limit">
			<div class="inner">

				<div class="test-font" data-font="<?php echo $font ?>" data-font-id="<?php echo $font_id ?>">
					
					<div class="test-font-group" data-tools="tools-group-1">
						<div class="test-font-group-focus"></div>
						<textarea class="test-font-h1 live" spellcheck="false">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</textarea>	
						<div class="test-font-h1 ghost"></div>
				
						<div class="instruction instruction-bottom instruction-2" data-instruction="2">
							<div class="instruction-triangle"></div>
							<div class="instruction-content">Haz click y edita este texto para probar la fuente</div>
						</div>

					</div>

					<div class="test-font-group" data-tools="tools-group-2">
						<div class="test-font-group-focus"></div>
						<textarea class="test-font-p live"  spellcheck="false">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores, odit, magnam, soluta, nihil explicabo maxime vel laboriosam deserunt temporibus numquam nesciunt impedit necessitatibus voluptatibus quod obcaecati beatae error similique quo quia!

Quas, veniam vel veritatis voluptates consectetur minus similique sint illo magni architecto ipsam asperiores cum. Iste, minima, expedita, dolore animi itaque qui sunt doloribus perferendis deleniti sapiente suscipit.

Soluta, assumenda, ratione, id magni quis laboriosam quae quo voluptatibus iusto placeat reiciendis doloremque voluptatem distincti.</textarea>
						<div class="test-font-p ghost"></div>
					</div>
			
				</div>

			</div>
		</div>
	</div>




	<div class="gallery">

		<div class="cols cols-nosep">
			<?php
			    while ( have_rows("gallery") ) : the_row();
			        $image = get_sub_field('image');
			?>
			<div class="col col-25">
				<img src="<?php echo $image["sizes"]["medium"] ?>" alt="Image" />				
			</div>
			<?php endwhile; ?>
		</div>	


	</div>



</div>




<div class="tools tools-single-font">
	
	<!--
	<div class="instruction instruction-top instruction-3" data-instruction="3">
		<div class="instruction-triangle"></div>
		<div class="instruction-content">Prueba las herramientas para cambiar las propiedades de la fuente</div>
	</div>
	-->

	<div class="tools-group tools-group-1">

		<div class="tools-hover">

			<div class="tool" data-css="font-size" data-to=".test-font-h1" data-min="15" data-max="150" data-init="50">
				<div class="tool-icon"><i class="fa fa-text-height"></i></div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
			<div class="tool" data-css="line-height" data-to=".test-font-h1" data-min="10" data-max="150" data-init="50">
				<div class="tool-icon"><i class="fa fa-align-justify"></i></div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
			<div class="tool" data-css="letter-spacing" data-to=".test-font-h1" data-min="-10" data-max="40" data-init="0">
				<div class="tool-icon">L <i class="fa fa-arrows-h"></i> L</div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
			<div class="tool" data-css="word-spacing" data-to=".test-font-h1" data-min="-20" data-max="100" data-init="0">
				<div class="tool-icon">P <i class="fa fa-arrows-h"></i> P</div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>

		</div>

		<div class="tool" data-css="text-transform" data-to=".test-font-h1" data-switch="uppercase|none" data-init="none">
			<div class="tool-icon"><i class="fa fa-caret-square-o-up"></i></div>
		</div>
		<!--
		<div class="tool" data-css="font-weight" data-to=".test-font-h1" data-switch="bold|normal" data-init="normal">
			<div class="tool-icon"><i class="fa fa-bold"></i></div>
		</div>
		-->
	</div>

	<div class="tools-group tools-group-2">

		<div class="tools-hover">
			<div class="tool" data-css="font-size" data-to=".test-font-p" data-min="15" data-max="150" data-init="20">
				<div class="tool-icon"><i class="fa fa-text-height"></i></div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
			<div class="tool" data-css="line-height" data-to=".test-font-p" data-min="10" data-max="150" data-init="20">
				<div class="tool-icon"><i class="fa fa-align-justify"></i></div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
			<div class="tool" data-css="letter-spacing" data-to=".test-font-p" data-min="-10" data-max="40" data-init="0">
				<div class="tool-icon">L <i class="fa fa-arrows-h"></i> L</div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
			<div class="tool" data-css="word-spacing" data-to=".test-font-p" data-min="-20" data-max="100" data-init="0">
				<div class="tool-icon">P <i class="fa fa-arrows-h"></i> P</div>
				<div class="tool-bar">
					<div class="tool-indicator"></div>
				</div>
			</div>
		</div>

		<div class="tool" data-css="text-transform" data-to=".test-font-p" data-switch="uppercase|none" data-init="none">
			<div class="tool-icon"><i class="fa fa-caret-square-o-up"></i></div>
		</div>
		
		<!--
		<div class="tool" data-css="font-weight" data-to=".test-font-p" data-switch="bold|normal" data-init="normal">
			<div class="tool-icon"><i class="fa fa-bold"></i></div>
		</div>
		-->

	</div>


</div>





<div class="tools tools-colors">
	<div class="tool" data-css="color" data-to=".test-font-h1,.test-font-p" data-select="FF2461|801231|4B2380|00CCCC|F1C202|e74c3c|FFFFCC|290B3B|06385C|9b59b6|1F184E|42D083|16A085|70FFE3|F55064|262A3B|FFFFFF|00FF99|910B46|F3BB8E" data-init="666666">
		<div class="tool-icon"><div class="tool-icon-color"><div class="tool-icon-color-inner"></div></div></div>
		<div class="tool-select">
		</div>
	</div>
	<div class="tool" data-css="background-color" data-to="#test-font-container" data-select="FF2461|801231|4B2380|00CCCC|F1C202|e74c3c|FFFFCC|290B3B|06385C|9b59b6|1F184E|42D083|16A085|70FFE3|F55064|262A3B|FFFFFF|00FF99|910B46|F3BB8E" data-init="FFFFFF">
		<div class="tool-icon"><div class="tool-icon-color tool-icon-bg"><div class="tool-icon-color-inner"></div></div></div>
		<div class="tool-select">
		</div>
	</div>
</div>



	<?php endwhile; ?>

<?php get_footer(); ?>