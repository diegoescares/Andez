<?php get_header(); ?>



<div class="page-header">
	<div class="limit">
		<div class="inner">
			<h1><?php the_author() ?></h1>	
			<div class="page-header-image">		
				<?php echo get_avatar(get_the_author_meta('ID'),150); ?>
			</div>
			<div class="page-header-description">		
				<?php echo get_the_author_meta('description'); ?>
			</div>
		</div>
	</div>
</div>


<div class="clear"></div>

<?php 

	$args['post_type'] = array( 'post','tipografias' );
	$args['author']    = get_the_author_meta("ID");

	echo $args['author'];
	query_posts( $args );

	if ( have_posts() ) :
		while ( have_posts() ) : the_post();

			include("loop.php");

		endwhile;
	endif;
?>


<?php get_footer(); ?>