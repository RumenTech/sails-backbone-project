define(['backbone'], function(Backbone) {

	var Connection = Backbone.Model.extend({

		initialize: function(attributes,options) {
			this.reqres = options.reqres;
		},
        fetch: function(attributes, options) {
            options = _.defaults((options || {}), {url: this.url()});
            return Backbone.Model.prototype.fetch.call(this, attributes, options);
        },
		url: function() {
			var config = this.reqres.request('config');
			return config.restUrl  + '/connection';
		}
	});

	return Connection;
});