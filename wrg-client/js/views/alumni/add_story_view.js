define([
	'backbone',
	'marionette',
	'text!templates/alumni/add_story.html',
	'views/alumni/story_form_view'
], function(Backbone, Marionette, Template, FormView) {
    "use strict";

	var AddStoryView = Marionette.ItemView.extend({
		template: Template,

		events: {
			'click .button.edit-story-modal': 'edit'
		},

		initialize: function(params) {
			this.model = params.data

			//1if (this.session.role == 'alumni') {
				this.model.set('isAlumni', true);
				this.model.set('hasProfile', !!(this.model));
		},

		edit: function() {
			this.trigger('showModal', this, FormView);
		}
	});

	return AddStoryView;
});