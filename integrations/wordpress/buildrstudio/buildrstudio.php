<?php
/**
 * Plugin Name:       BuildrStudio AI Agent
 * Plugin URI:        https://buildrstudio.in
 * Description:       Adds your BuildrStudio AI agent (chat widget) to every page of your site. Paste your agent ID and API key in Settings → BuildrStudio.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            BuildrStudio
 * Author URI:        https://buildrstudio.in
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       buildrstudio
 *
 * @package BuildrStudio
 */

/*
BuildrStudio AI Agent is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

BuildrStudio AI Agent is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BUILDRSTUDIO_VERSION', '1.0.0' );
define( 'BUILDRSTUDIO_OPTION', 'buildrstudio_settings' );
define( 'BUILDRSTUDIO_HANDLE', 'buildrstudio-widget' );

/**
 * Default option values.
 *
 * @return array
 */
function buildrstudio_defaults() {
	return array(
		'enabled'  => 1,
		'agent_id' => '',
		'api_key'  => '',
		'greeting' => '',
		'color'    => '',
		'position' => '',
	);
}

/**
 * Saved settings merged over defaults.
 *
 * @return array
 */
function buildrstudio_get_settings() {
	$saved = get_option( BUILDRSTUDIO_OPTION, array() );
	if ( ! is_array( $saved ) ) {
		$saved = array();
	}
	return array_merge( buildrstudio_defaults(), $saved );
}

/**
 * URL of the hosted widget script. Filterable for staging/testing.
 *
 * @return string
 */
function buildrstudio_widget_src() {
	return (string) apply_filters( 'buildrstudio_widget_src', 'https://buildrstudio.in/widget.js' );
}

/**
 * Whether the plugin has what it needs to render the widget.
 *
 * @param array $settings Settings.
 * @return bool
 */
function buildrstudio_is_configured( $settings ) {
	return '' !== $settings['agent_id'] && '' !== $settings['api_key'];
}

/* -------------------------------------------------------------------------
 * Front end
 * ---------------------------------------------------------------------- */

/**
 * Enqueue the widget in the footer.
 */
function buildrstudio_enqueue_widget() {
	if ( is_admin() ) {
		return;
	}
	$settings = buildrstudio_get_settings();
	if ( empty( $settings['enabled'] ) || ! buildrstudio_is_configured( $settings ) ) {
		return;
	}

	// Version null: no ?ver= query string. The hosted widget is versioned server-side.
	wp_enqueue_script( BUILDRSTUDIO_HANDLE, esc_url_raw( buildrstudio_widget_src() ), array(), null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion

	// Optional per-site overrides. Anything left blank falls back to the
	// greeting / colour / position saved in the BuildrStudio dashboard.
	$overrides = array();
	if ( '' !== $settings['greeting'] ) {
		$overrides['greeting'] = $settings['greeting'];
	}
	if ( '' !== $settings['color'] ) {
		$overrides['color'] = $settings['color'];
	}
	if ( '' !== $settings['position'] ) {
		$overrides['position'] = $settings['position'];
	}
	if ( ! empty( $overrides ) ) {
		wp_add_inline_script(
			BUILDRSTUDIO_HANDLE,
			'window.BuildrAgentConfig = Object.assign({}, window.BuildrAgentConfig || {}, ' . wp_json_encode( $overrides, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ) . ');',
			'before'
		);
	}
}
add_action( 'wp_enqueue_scripts', 'buildrstudio_enqueue_widget' );

/**
 * Add the data-agent-id / data-key attributes the widget reads from its own tag.
 *
 * @param string $tag    Script tag HTML.
 * @param string $handle Script handle.
 * @return string
 */
function buildrstudio_script_attributes( $tag, $handle ) {
	if ( BUILDRSTUDIO_HANDLE !== $handle ) {
		return $tag;
	}
	$settings = buildrstudio_get_settings();
	$attrs    = sprintf(
		' data-agent-id="%s" data-key="%s"',
		esc_attr( $settings['agent_id'] ),
		esc_attr( $settings['api_key'] )
	);
	$src_pos = strpos( $tag, ' src=' );
	if ( false === $src_pos ) {
		return $tag;
	}
	return substr_replace( $tag, $attrs, $src_pos, 0 );
}
add_filter( 'script_loader_tag', 'buildrstudio_script_attributes', 10, 2 );

/* -------------------------------------------------------------------------
 * Admin
 * ---------------------------------------------------------------------- */

/**
 * Register the setting (Settings API handles the nonce + capability check).
 */
function buildrstudio_register_settings() {
	register_setting(
		'buildrstudio',
		BUILDRSTUDIO_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'buildrstudio_sanitize_settings',
			'default'           => buildrstudio_defaults(),
			'show_in_rest'      => false,
		)
	);

	add_settings_section( 'buildrstudio_main', __( 'Connect your agent', 'buildrstudio' ), 'buildrstudio_section_main', 'buildrstudio' );
	add_settings_field( 'enabled', __( 'Show widget', 'buildrstudio' ), 'buildrstudio_field_enabled', 'buildrstudio', 'buildrstudio_main' );
	add_settings_field( 'agent_id', __( 'Agent ID', 'buildrstudio' ), 'buildrstudio_field_agent_id', 'buildrstudio', 'buildrstudio_main', array( 'label_for' => 'buildrstudio_agent_id' ) );
	add_settings_field( 'api_key', __( 'API key', 'buildrstudio' ), 'buildrstudio_field_api_key', 'buildrstudio', 'buildrstudio_main', array( 'label_for' => 'buildrstudio_api_key' ) );

	add_settings_section( 'buildrstudio_look', __( 'Appearance overrides (optional)', 'buildrstudio' ), 'buildrstudio_section_look', 'buildrstudio' );
	add_settings_field( 'greeting', __( 'Greeting', 'buildrstudio' ), 'buildrstudio_field_greeting', 'buildrstudio', 'buildrstudio_look', array( 'label_for' => 'buildrstudio_greeting' ) );
	add_settings_field( 'color', __( 'Brand colour', 'buildrstudio' ), 'buildrstudio_field_color', 'buildrstudio', 'buildrstudio_look', array( 'label_for' => 'buildrstudio_color' ) );
	add_settings_field( 'position', __( 'Position', 'buildrstudio' ), 'buildrstudio_field_position', 'buildrstudio', 'buildrstudio_look', array( 'label_for' => 'buildrstudio_position' ) );
}
add_action( 'admin_init', 'buildrstudio_register_settings' );

/**
 * Sanitize everything that comes in from the settings form.
 *
 * @param mixed $input Raw input.
 * @return array
 */
function buildrstudio_sanitize_settings( $input ) {
	$input = is_array( $input ) ? $input : array();
	$out   = buildrstudio_defaults();

	$out['enabled'] = empty( $input['enabled'] ) ? 0 : 1;

	$agent_id = isset( $input['agent_id'] ) ? strtolower( trim( sanitize_text_field( wp_unslash( $input['agent_id'] ) ) ) ) : '';
	if ( '' !== $agent_id && ! preg_match( '/^[a-z0-9][a-z0-9-]{0,63}$/', $agent_id ) ) {
		add_settings_error( BUILDRSTUDIO_OPTION, 'agent_id', __( 'Agent ID should look like "support-agent-starter" (lowercase letters, numbers and dashes).', 'buildrstudio' ) );
		$agent_id = '';
	}
	$out['agent_id'] = $agent_id;

	$api_key = isset( $input['api_key'] ) ? trim( sanitize_text_field( wp_unslash( $input['api_key'] ) ) ) : '';
	if ( '' !== $api_key && ! preg_match( '/^pk_live_[a-f0-9]{8,64}$/', $api_key ) ) {
		add_settings_error( BUILDRSTUDIO_OPTION, 'api_key', __( 'API key should start with "pk_live_". Copy it from your BuildrStudio dashboard.', 'buildrstudio' ) );
		$api_key = '';
	}
	$out['api_key'] = $api_key;

	$greeting        = isset( $input['greeting'] ) ? sanitize_text_field( wp_unslash( $input['greeting'] ) ) : '';
	$out['greeting'] = function_exists( 'mb_substr' ) ? mb_substr( $greeting, 0, 200 ) : substr( $greeting, 0, 200 );

	$color        = isset( $input['color'] ) ? sanitize_hex_color( wp_unslash( $input['color'] ) ) : '';
	$out['color'] = $color ? $color : '';

	$position        = isset( $input['position'] ) ? sanitize_key( wp_unslash( $input['position'] ) ) : '';
	$out['position'] = in_array( $position, array( 'bottom-right', 'bottom-left' ), true ) ? $position : '';

	return $out;
}

/**
 * Section intro: where to find the values.
 */
function buildrstudio_section_main() {
	printf(
		'<p>%s <a href="%s" target="_blank" rel="noopener noreferrer">%s</a>.</p>',
		esc_html__( 'Find your agent ID and API key in the embed code on your', 'buildrstudio' ),
		esc_url( 'https://buildrstudio.in/dashboard' ),
		esc_html__( 'BuildrStudio dashboard', 'buildrstudio' )
	);
}

/**
 * Section intro: overrides.
 */
function buildrstudio_section_look() {
	echo '<p>' . esc_html__( 'Leave these blank to use the greeting, colour and position saved in your BuildrStudio dashboard.', 'buildrstudio' ) . '</p>';
}

/**
 * Field: enabled.
 */
function buildrstudio_field_enabled() {
	$s = buildrstudio_get_settings();
	printf(
		'<label><input type="checkbox" name="%s[enabled]" value="1" %s /> %s</label>',
		esc_attr( BUILDRSTUDIO_OPTION ),
		checked( 1, (int) $s['enabled'], false ),
		esc_html__( 'Show the chat widget on my site', 'buildrstudio' )
	);
}

/**
 * Field: agent id.
 */
function buildrstudio_field_agent_id() {
	$s = buildrstudio_get_settings();
	printf(
		'<input type="text" class="regular-text code" id="buildrstudio_agent_id" name="%s[agent_id]" value="%s" placeholder="support-agent-starter" autocomplete="off" /><p class="description">%s</p>',
		esc_attr( BUILDRSTUDIO_OPTION ),
		esc_attr( $s['agent_id'] ),
		esc_html__( 'The data-agent-id value from your embed code.', 'buildrstudio' )
	);
}

/**
 * Field: api key.
 */
function buildrstudio_field_api_key() {
	$s = buildrstudio_get_settings();
	printf(
		'<input type="text" class="regular-text code" id="buildrstudio_api_key" name="%s[api_key]" value="%s" placeholder="pk_live_…" autocomplete="off" spellcheck="false" /><p class="description">%s</p>',
		esc_attr( BUILDRSTUDIO_OPTION ),
		esc_attr( $s['api_key'] ),
		esc_html__( 'The data-key value from your embed code. It is a public key: it ends up in your page source either way.', 'buildrstudio' )
	);
}

/**
 * Field: greeting.
 */
function buildrstudio_field_greeting() {
	$s = buildrstudio_get_settings();
	printf(
		'<input type="text" class="regular-text" id="buildrstudio_greeting" name="%s[greeting]" value="%s" maxlength="200" placeholder="%s" />',
		esc_attr( BUILDRSTUDIO_OPTION ),
		esc_attr( $s['greeting'] ),
		esc_attr__( 'Hi! How can I help you today?', 'buildrstudio' )
	);
}

/**
 * Field: colour.
 */
function buildrstudio_field_color() {
	$s = buildrstudio_get_settings();
	printf(
		'<input type="text" class="code" style="width:8em" id="buildrstudio_color" name="%s[color]" value="%s" maxlength="7" placeholder="#2563eb" pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?" /><p class="description">%s</p>',
		esc_attr( BUILDRSTUDIO_OPTION ),
		esc_attr( $s['color'] ),
		esc_html__( 'Hex colour, e.g. #2563eb.', 'buildrstudio' )
	);
}

/**
 * Field: position.
 */
function buildrstudio_field_position() {
	$s       = buildrstudio_get_settings();
	$options = array(
		''             => __( 'Use dashboard setting', 'buildrstudio' ),
		'bottom-right' => __( 'Bottom right', 'buildrstudio' ),
		'bottom-left'  => __( 'Bottom left', 'buildrstudio' ),
	);
	printf( '<select id="buildrstudio_position" name="%s[position]">', esc_attr( BUILDRSTUDIO_OPTION ) );
	foreach ( $options as $value => $label ) {
		printf( '<option value="%s" %s>%s</option>', esc_attr( $value ), selected( $s['position'], $value, false ), esc_html( $label ) );
	}
	echo '</select>';
}

/**
 * Add Settings → BuildrStudio.
 */
function buildrstudio_admin_menu() {
	add_options_page(
		__( 'BuildrStudio AI Agent', 'buildrstudio' ),
		__( 'BuildrStudio', 'buildrstudio' ),
		'manage_options',
		'buildrstudio',
		'buildrstudio_render_settings_page'
	);
}
add_action( 'admin_menu', 'buildrstudio_admin_menu' );

/**
 * Render the settings page.
 */
function buildrstudio_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'buildrstudio' );
			do_settings_sections( 'buildrstudio' );
			submit_button();
			?>
		</form>
	</div>
	<?php
}

/**
 * "Settings" link on the Plugins screen.
 *
 * @param array $links Action links.
 * @return array
 */
function buildrstudio_action_links( $links ) {
	$url = admin_url( 'options-general.php?page=buildrstudio' );
	array_unshift( $links, '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'buildrstudio' ) . '</a>' );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'buildrstudio_action_links' );

/**
 * Nudge admins until the plugin is configured.
 */
function buildrstudio_admin_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( $screen && 'settings_page_buildrstudio' === $screen->id ) {
		return;
	}
	if ( buildrstudio_is_configured( buildrstudio_get_settings() ) ) {
		return;
	}
	printf(
		'<div class="notice notice-info"><p>%s <a href="%s">%s</a></p></div>',
		esc_html__( 'BuildrStudio AI Agent is active but not connected yet.', 'buildrstudio' ),
		esc_url( admin_url( 'options-general.php?page=buildrstudio' ) ),
		esc_html__( 'Add your agent ID and API key', 'buildrstudio' )
	);
}
add_action( 'admin_notices', 'buildrstudio_admin_notice' );
