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

<?php get_footer(); ?>