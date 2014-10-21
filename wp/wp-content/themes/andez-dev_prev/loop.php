
<?php 
	if($post->post_type=="tipografias"){


	$test_texts = "";
    while ( have_rows("texts") ) : the_row();

        $test_texts .= ",".get_sub_field('text');

    endwhile;

//    echo $test_texts;


?>

	<div class="hola hola-<?php echo rand(1,10) ?>" data-font="<?php the_title() ?>" data-font-id="<?php echo $post->ID ?>">
		<div class="hola-bg"></div>
		<a href="<?php the_permalink(); ?>" class="hola-link">
			<div class="hola-circle">
				<i class="fa fa-angle-right"></i>
			</div>
			<span class="hola-category"><span>Categoría</span></span>
			<span class="hola-title"><?php the_title() ?></span>
		</a>
	</div>

<?php }else{ ?>

	<div class="hola" <?php echo $data_html; ?>>
		<div class="hola-image">
			<?php the_post_thumbnail("medium") ?>
		</div>
		<a href="<?php the_permalink(); ?>" class="hola-link">
			<div class="hola-circle">
				<i class="fa fa-angle-right"></i>
			</div>
			<span class="hola-category"><span>Categoría</span></span>
			<span class="hola-title"><?php the_title() ?></span>
		</a>
	</div>

<?php } ?>
