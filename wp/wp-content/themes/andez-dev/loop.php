
<?php 
	if($post->post_type=="tipografias"){


	$test_texts = "";
    while ( have_rows("texts") ) : the_row();
        $test_texts .= get_sub_field('text')."||";
    endwhile;
    if($test_texts){
	    $test_texts = str_replace("'","",str_replace("||------","",$test_texts."------"));
    }

?>

	<div class="hola hola-<?php echo rand(1,10) ?>" data-font="<?php the_title() ?>" data-font-id="<?php echo $post->ID ?>">
		<div class="hola-bg" data-texts='<?php echo $test_texts ?>'></div>
		<a href="<?php the_permalink(); ?>" class="hola-link">
			<div class="hola-circle">
				<i class="fa fa-angle-right"></i>
			</div>
			<span class="hola-category"><span>Tipografías</span></span>
			<span class="hola-title"><?php the_title() ?></span>
		</a>
		<img class="hola-proportion" src="<?php bloginfo("template_url") ?>/img/pixel.png" alt="Andez" />
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
			<span class="hola-category"><span><?php

				$post_categories = wp_get_post_categories( $post->ID );
				$cats = array();
					
				foreach($post_categories as $c){
					$cat = get_category( $c );
					$cats = $cat->name . ", ";
				}

				$cats = str_replace(", .........","",$cats.".........");
				echo $cats;

			?></span></span>
			<span class="hola-title"><?php the_title() ?></span>
		</a>
		<img class="hola-proportion" src="<?php bloginfo("template_url") ?>/img/pixel.png" alt="Andez" />
	</div>

<?php } ?>
