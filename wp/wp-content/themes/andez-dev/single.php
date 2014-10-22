<?php get_header(); ?>

	<?php while ( have_posts() ) : the_post(); ?>

		<?php 
			$categories = get_the_category();
			$separator = ' ';
			$output = '';
			if($categories){
				foreach($categories as $category) {
					$categories_class .= "page-".$category->slug.$separator; 
					$output .= '<a href="'.get_category_link( $category->term_id ).'" title="' . esc_attr( sprintf( __( "View all posts in %s" ), $category->name ) ) . '">'.$category->cat_name.'</a>'.$separator;
				}
			$categories_class = trim($categories_class);
			//echo trim($output, $separator);
			}
		 ?>

		<div class="page <?php echo $categories_class ?>">
			<?php
				$thumb_id = get_post_thumbnail_id();
				$thumb = wp_get_attachment_image_src($thumb_id,"large");
				$thumb = $thumb[0];
				if($thumb){
				?>
				<div class="page-cover" style="background-image:url(<?php echo $thumb ?>);"></div>
			<?php } ?>
			<div class="limit">
				<div class="inner">

					<div class="single-content">
					
						<div class="content">
							<h1 class="center"><?php the_title() ?></h1>
							<?php the_content() ?>
						</div>

					</div>

					<?php $file = get_field('file'); ?>

					<?php if($file){ ?>
						<div class="single-download">
							<a href="<?php echo $file["url"] ?>" class="button button-big button-line-white" target="_blank">Descargar archivo</a>
						</div>
					<?php } ?>

				</div>
			</div>
		</div>

	<?php endwhile; ?>

<?php get_footer(); ?>