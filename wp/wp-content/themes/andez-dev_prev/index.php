<?php get_header(); ?>

<?php 

	if(is_home()){
		$args['post_type']   = array( 'post','tipografias' );
		//$args["numberposts"] = -1;
		query_posts( $args );
	}

	if ( have_posts() ) :
		while ( have_posts() ) : the_post();

			include("loop.php");

		endwhile;
	endif;
?>


<?php
/*
	$i=1;
	$dir    = 'fonts-andez';
	$files = scandir($dir);
	foreach($files as $file){
	if($file!="." && $file!=".." && $file!=".DS_Store"){
	if(file_exists($dir."/".$file."/font.css")){
	$class = " hola-".rand(1,10);
	if($i==1){ $class.=" hola-big"; }
	if($i==2){ $class.=" hola-double"; }	
	$i++;
?>

	<?php if($i>2 && $i!=7 && $i!=10 && $i!=16){ ?>
	<div class="hola" data-font="<?php echo $file ?>">
		<div class="hola-image">
			<img src="http://lorempixel.com/400/400/?rand=<?php echo rand(1,99) ?>" alt="Hola" />
		</div>
		<a href="single.php" class="hola-link">
			<div class="hola-circle">
				<i class="fa fa-angle-right"></i>
			</div>
			<span class="hola-category"><span>Categoría</span></span>
			<span class="hola-title">Lorem ipsum dolor sit amet</span>
		</a>
	</div>
	<?php } ?>


<?php
	}}}
	*/
?>


<?php get_footer(); ?>