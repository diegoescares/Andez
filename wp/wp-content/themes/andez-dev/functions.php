<?php





	add_theme_support( 'post-thumbnails' ); 
	#add_theme_support( 'menus' );



	// falta tamaño avatar

	function newsizes() {
		add_image_size('medium', 400, 400, true);
		add_image_size('bigger', 1440, 1440);
	}
	add_action( 'after_setup_theme', 'newsizes' );



	// Registrar post types

	register_post_type('tipografias', array(
		'labels'			 => array('name'=>'Tipografías'), 
		'public'             => true,
		'has_archive'        => true,
		'menu_position'		 => 5,
		'menu_icon'          => "dashicons-editor-paste-text",
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'author')
	));

	function add_categories_in_postypes() {
		register_taxonomy_for_object_type('category','fuentes');
	}
	//add_action('init', 'add_categories_in_postypes');








	// Global post ordering
	if ( class_exists("global_posts_ordering") ) {
	   $global_posts_ordering = new global_posts_ordering(array("noticias", "obras", "artistas"));
	}





	function remove_menus () {
	global $menu;
		//$restricted = array(__('Dashboard'), __('Posts'), __('Media'), __('Links'), __('Pages'), __('Appearance'), __('Tools'), __('Users'), __('Settings'), __('Comments'), __('Plugins'));
		$restricted = array(__('Posts'));
		end ($menu);
		while (prev($menu)){
			$value = explode(' ',$menu[key($menu)][0]);
			if(in_array($value[0] != NULL?$value[0]:"" , $restricted)){unset($menu[key($menu)]);}
		}
	}
	//add_action('admin_menu', 'remove_menus');








	// [vimeo url=http://...]
	function vimeo_code( $atts ) {
		extract( shortcode_atts( array(
			'url' => 'true'
		), $atts ) );

		if(isset($atts['url'])){
			$explode_url = explode("/",$atts['url']);
			$explode_url = explode("?",$explode_url[3]);
			$code = $explode_url[0];
			return '<iframe class="vimeo" src="//player.vimeo.com/video/'.$code.'?color=ff0179" width="100%" height="432" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		}
	}
	add_shortcode( 'vimeo', 'vimeo_code' );


	// [soundcloud url=http://...]
	function soundcloud_code( $atts ) {
		extract( shortcode_atts( array(
			'url' => 'true'
		), $atts ) );

		if(isset($atts['url'])){
			return '<iframe class="soundcloud" width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url='.$atts['url'].'"></iframe>';

		}
	}
	add_shortcode( 'soundcloud', 'soundcloud_code' );









function twentyfourteen_wp_title( $title, $sep ) {
	global $paged, $page;

	if ( is_feed() ) {
		return $title;
	}

	// Add the site name.
	$title .= get_bloginfo( 'name' );

	// Add the site description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) ) {
		$title = "$title $sep $site_description";
	}

	// Add a page number if necessary.
	if ( $paged >= 2 || $page >= 2 ) {
		$title = "$title $sep " . sprintf( __( 'Page %s', 'twentyfourteen' ), max( $paged, $page ) );
	}

	return $title;
}
add_filter( 'wp_title', 'twentyfourteen_wp_title', 10, 2 );




function font_extensions ( $existing_mimes=array() ) {

	$existing_mimes['svg']  = 'image/svg+xml';
	$existing_mimes['svg']  = 'application/x-font-ttf';
	$existing_mimes['svg']  = 'application/x-font-truetype';

	$existing_mimes['otf']  = 'font/opentype';
	$existing_mimes['otf']  = 'application/x-font-opentype';
	$existing_mimes['otf']  = 'application/font-sfnt';

	$existing_mimes['woff'] = 'application/font-woff';
	$existing_mimes['woff'] = 'application/x-woff';

	$existing_mimes['eot']  = 'application/vnd.ms-fontobject';

	$existing_mimes['ttf']  = 'font/ttf';
	$existing_mimes['ttf']  = 'application/font-sfnt';
	$existing_mimes['ttf']  = 'application/x-font-ttf';
	$existing_mimes['ttf']  = 'application/octet-stream';


	return $existing_mimes;

}
add_filter('upload_mimes', 'font_extensions');




function custom_upload_directory( $args ) {

    $id = $_REQUEST['post_id'];
    $parent = get_post( $id )->post_parent;
 
    // Check the post-type of the current post
    if( "tipografias" == get_post_type( $id ) || "tipografias" == get_post_type( $parent ) ) {
        $args['path'] = str_replace("/themes/andez-dev","",dirname(__FILE__)) . "/fonts/".$id;
        $args['url']  = str_replace("/themes/andez-dev","",dirname(__FILE__)) . "/fonts/".$id;
        $args['basedir'] = str_replace("/themes/andez-dev","",dirname(__FILE__)) . "/fonts";
        $args['baseurl'] = get_bloginfo("url") . "/wp-content/fonts";
    }
    return $args;

}
add_filter( 'upload_dir', 'custom_upload_directory' );


?>