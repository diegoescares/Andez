<?php get_header(); ?>

<div class="page-header">
	<div class="inner">
		<h1><?php the_author() ?></h1>	
	</div>
</div>

<?php echo get_avatar(get_the_author_meta('ID'),150); ?>
<?php echo get_the_author_meta('description'); ?>

<div class="clear"></div>

<?php 



	$args['post_type'] = array( 'post','tipografias' );
	$args['author']    = get_the_author_meta("ID");
	query_posts( $args );

	if ( have_posts() ) :
		while ( have_posts() ) : the_post();

			include("loop.php");

		endwhile;
	endif;
?>

<?php get_footer(); ?>