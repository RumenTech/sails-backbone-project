define(['backbone'], function(Backbone) {

	var Alumnus = Backbone.Model.extend({

		initialize: function(options) {
			if(this.collection) {
				this.reqres = this.collection.reqres;
			} else {
				this.reqres = options.reqres;
			}
		},

		url: function() {
			var config = this.reqres.request('config');
			return config.restUrl + '/alumnistory/me';
		}
	});

	return Alumnus;
});