define([
	'marionette',
	'text!templates/portfolio/sponsors.html'
], function(Marionette, Template) {
    'use strict';

	var SponsorsView = Marionette.ItemView.extend({
		template: Template,

        initialize: function(params) {
            this.model = params.data;
        },

        onRender: function(){
            this.$el.find("#progressBar").css('width', this.model.get("completeness") + "%");
        }
	});
	return SponsorsView;
});