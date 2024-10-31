<?php
/*
Plugin Name: PlaceSurf
Plugin URI: http://placesurf.com/wordpress_plugin.php
Description: Adds PlaceSurf button to TinyMCE editor to allow easily adding Google Earth locations
Version: 1.0
Author: Hugo Byrne
Author URI: http://placesurf.com

Released under the GPL v.2, http://www.gnu.org/copyleft/gpl.html

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
*/

function placesurf_addbuttons() {
   // Don't bother doing this stuff if the current user lacks permissions
   if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )
     return;

   // Add only in Rich Editor mode
   if ( get_user_option('rich_editing') == 'true') {
     add_filter("mce_external_plugins", "add_placesurf_tinymce_plugin");
     add_filter('mce_buttons', 'register_placesurf_button');
   }
}

function register_placesurf_button($buttons) {
   array_push($buttons, "separator", "placesurf");
   return $buttons;
}

// Load the TinyMCE plugin : editor_plugin.js (wp2.5)
function add_placesurf_tinymce_plugin($plugin_array) {
   $plugin_array['placesurf'] = WP_PLUGIN_URL .'/placesurf/files/editor_plugin.js';
   return $plugin_array;
}

// init process for button control
add_action('init', 'placesurf_addbuttons');
