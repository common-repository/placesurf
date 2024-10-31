(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('placesurf');

	tinymce.create('tinymce.plugins.placesurfPlugin', {

		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */

		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceplacesurf');
			ed.addCommand('mceplacesurf', function() {

				var selected_text = tinyMCE.activeEditor.selection.getContent();
				if(selected_text=="")
				{
					var msg = '';
					msg += '\nPlease first select text to be assigned a Google Earth link\n\n';
					msg += 'Unable to continue.\n\n';
					alert(msg);
					return;
				}

				ed.windowManager.open({
					file : url + '/dialog.htm',
					//width : 640  + ed.getLang('placesurf.delta_width', 0),
					//height : 480 + ed.getLang('placesurf.delta_height', 0),
					width  : 900,
					height : 620,
					inline : 1
				}, {
					plugin_url : url, // Plugin absolute URL
					some_custom_arg : 'custom arg' // Custom argument
				});


			});

			// Register placesurf button
			ed.addButton('placesurf', {
				title : ed.getLang('placesurf_dlg.button_description', 0),
				cmd   : 'mceplacesurf',
				image : url + '/img/gearth_icon.jpg'
			});

			// Add a node change handler, selects the button in the UI when a image is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('placesurf', n.nodeName == 'IMG');
			});
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname  : 'placesurf plugin',
				author    : 'Hugo Byrne',
				authorurl : 'http://placesurf.com',
				infourl   : 'http://placesurf.com/wordpress_plugin.php',
				version   : "1.1"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('placesurf', tinymce.plugins.placesurfPlugin);
})();
