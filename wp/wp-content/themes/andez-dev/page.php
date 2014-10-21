<?php get_header(); ?>

	<?php while ( have_posts() ) : the_post(); ?>

		<div class="page">
			<div class="limit">
				<div class="inner">
					
					<div class="content">
						<h1 class="center"><?php the_title() ?></h1>			
						<?php the_content() ?>
					</div>
					

					<!--
			        <form method="POST" class="controls controls-center" action="">
			          
			            <div class="control">
			                <div class="control-name">Email</div>
			                <div class="control-value"><input type="email" name="email" /></div>
			            </div>

			             <div class="control">
			                <div class="control-name">Nombre</div>
			                <div class="control-value"><input type="text" name="nombre" /></div>
			            </div>

			             <div class="control">
			                <div class="control-name">Asunto</div>
			                <div class="control-value"><input type="text" name="asunto" /></div>
			            </div>

			            <div class="control">
			                <div class="control-name">Mensaje</div>
			                <div class="control-value"><textarea name="message"></textarea></div>
			            </div>

			            <div class="control">
			                <div class="control-name"></div>
			                <div class="control-value">
			                    <input type="submit" class="button button-medium button-primary" value="Enviar mensaje" />
			                </div>
			            </div>

			        </form>
				    -->

				</div>
			</div>
		</div>

	<?php endwhile; ?>

<?php get_footer(); ?>