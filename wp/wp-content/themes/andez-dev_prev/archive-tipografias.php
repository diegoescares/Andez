<?php get_header(); ?>


<div class="page page-fuentes">


	<div class="inner">
		
		<h1 class="none">Tipografías</h1>

		<div class="articles-font">
			<div class="cols cols-nosep">


				<?php
					$font_count=0;
					if ( have_posts() ) :
						while ( have_posts() ) : the_post();
						$font_count++;
						?>

							<div class="col col-33">
								<div class="col-inner">

									<article class="article-font" data-font="<?php the_title() ?>" data-font-id="<?php echo $post->ID; ?>">
										<div class="article-inner">
											<div class="article-header">
												<h2 class="article-title"><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h2>
												<a href="#" class="article-author"><img src="img/user.jpg" alt=""> Diego Escares</a>
											</div>
											<div class="article-body">
												<div class="font" data-font="<?php the_title() ?>" data-font-id="<?php echo $post->ID; ?>">
													<input type="text" class="font-big" value="Lorem ipsum dolor" />
													<div class="font-small">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ123456789@$%&¡!()¿?{}"</div>
												</div>
												<?php if($font_count==1){ ?>
												<div class="instruction instruction-bottom instruction-1">
													<div class="instruction-triangle"></div>
													<div class="instruction-content">Haz click y edita este texto para probar la fuente</div>
												</div>
												<?php } ?>
											</div>
											<div class="article-footer">
												<a href="<?php the_permalink() ?>" class="button button-personalized">Ver fuente</a>
											</div>
										</div>
									</article>

								</div>
							</div>

						<?php
						endwhile;
					endif;
				?>

			</div>
		</div>


	</div>

</div>




<div class="tools tools-colors">
	<div class="tool" data-css="font-size" data-to=".article-font .font .font-big" data-min="20" data-max="80" data-init="60">
		<div class="tool-icon"><i class="fa fa-text-height"></i></div>
		<div class="tool-bar">
			<div class="tool-indicator"></div>
		</div>
	</div>
	<div class="tool" data-css="color" data-to=".article-font .font, .article-font .font .font-big, .article-font a" data-select="FF2461|801231|4B2380|00CCCC|F1C202|e74c3c|FFFFCC|290B3B|06385C|9b59b6|1F184E|42D083|16A085|70FFE3|F55064|262A3B|FFFFFF|00FF99|910B46|F3BB8E" data-init="666666">
		<div class="tool-icon"><div class="tool-icon-color"><div class="tool-icon-color-inner"></div></div></div>
		<div class="tool-select">
		</div>
	</div>
	<div class="tool" data-css="background-color" data-to=".page" data-select="FF2461|801231|4B2380|00CCCC|F1C202|e74c3c|FFFFCC|290B3B|06385C|9b59b6|1F184E|42D083|16A085|70FFE3|F55064|262A3B|FFFFFF|00FF99|910B46|F3BB8E" data-init="FFFFFF">
		<div class="tool-icon"><div class="tool-icon-color tool-icon-bg"><div class="tool-icon-color-inner"></div></div></div>
		<div class="tool-select">
		</div>
	</div>
</div>



<?php get_footer(); ?>