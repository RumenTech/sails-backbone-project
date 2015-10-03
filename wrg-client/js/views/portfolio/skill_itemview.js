define([
	'marionette',
	'text!templates/portfolio/skill.html'
], function(Marionette, Template) {
    'use strict';

	var SkillItemView = Marionette.ItemView.extend({
		template: Template,

		tagName: 'dl',

		className: function() {
			return 'skill-' + this.model.get('proficiency_level');
		}
	});
	return SkillItemView;
});