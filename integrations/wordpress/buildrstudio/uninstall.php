<?php
/**
 * Uninstall: remove everything the plugin stored.
 *
 * @package BuildrStudio
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'buildrstudio_settings' );

if ( is_multisite() ) {
	$buildrstudio_site_ids = get_sites(
		array(
			'fields' => 'ids',
			'number' => 0,
		)
	);
	foreach ( $buildrstudio_site_ids as $buildrstudio_site_id ) {
		switch_to_blog( $buildrstudio_site_id );
		delete_option( 'buildrstudio_settings' );
		restore_current_blog();
	}
}
