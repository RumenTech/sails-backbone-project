define(['backbone'], function(Backbone) {
	
	var StudentModel = Backbone.Model.extend({

        save: function(attributes, options) {
            options = _.defaults((options || {}), {url: this.url()});
            return Backbone.Model.prototype.save.call(this, attributes, options);
        },

		initialize: function(attributes, params) {

			this.reqres = params.reqres;
            this.config= this.reqres.request('config');
			//this.session = this.reqres.request('session');
			this.fetch({
				success: _.bind(function() {
					this.trigger('loaded');
				}, this)
			});

		},

		parse: function(response) {
			return response;
		},
        url:function(){
          return  this.config.restUrl + '/student/me';
        }

	});
	return StudentModel;
});