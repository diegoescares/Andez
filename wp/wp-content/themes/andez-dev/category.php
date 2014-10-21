<?php get_header(); ?>

<div class="page-header">
	<div class="inner">
		<h1><?php single_cat_title() ?></h1>	
	</div>
</div>


<div class="clear"></div>

<?php 

	$cat = get_the_category();
	$id  = $cat[0]->term_id;

	$args['post_type'] = array( 'post','tipografias' );
	$args['author']    = $id;

	query_posts( $args );

	if ( have_posts() ) :
		while ( have_posts() ) : the_post();

			include("loop.php");

		endwhile;
	endif;
	
?>

<?php get_footer(); ?>