define([
	'backbone',
	'models/alumnus'
], function(Backbone, Alumnus) {

	var AlumniCollection = Backbone.Collection.extend({
		model: Alumnus,

		initialize: function(attributes, params) {
			this.reqres = params.reqres;
			this.session = this.reqres.request('session');

			this.fetch({
				success: _.bind(function() {
					this.trigger('loaded');
				}, this)
			});
		},

		parse: function(response) {
			return response.rows;
		},

		url: function() {
			var config = this.reqres.request('config');
			return config.restUrl + '/alumnistory/filter'
		}
	});

	return AlumniCollection;
});