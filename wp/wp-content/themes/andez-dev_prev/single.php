<?php get_header(); ?>

	<?php while ( have_posts() ) : the_post(); ?>

		<div class="page">
			<div class="limit">
				<div class="inner">
					
					<div class="content">
						<h1><?php the_title() ?></h1>			
						<?php the_content() ?>
					</div>

				</div>
			</div>
		</div>

	<?php endwhile; ?>

<?php get_footer(); ?>