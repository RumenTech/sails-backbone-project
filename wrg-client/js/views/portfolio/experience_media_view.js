define([
	'marionette',
	'text!templates/portfolio/project_media.html',
    'lib/foundation',
    'lib/foundation.orbit',
    'models/portfolio/experience'
], function(Marionette, Template, Foundation, Orbit, Experience) {
    'use strict';

	var ExperienceMediaView = Marionette.ItemView.extend({
		template: Template,
		events: {
			'click .close-reveal-modal .close-modal': 'closeModal'
		},
		initialize: function(params) {

		},
		onBeforeRender: function() {
		},
		onRender: function(params) {
			this.$el.foundation();
		}
	});
	return ExperienceMediaView;
});