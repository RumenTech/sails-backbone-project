define(['backbone'], function(Backbone) {

	var PersonalStatement = Backbone.Model.extend({

		initialize: function(attributes, params) {
			this.reqres = params.reqres;
			this.session = this.reqres.request('session');
			this.id = this.session.id;
			if (!this.get('video_url')) {
				this.set('video_url', '//placehold.it/480x300');
			}

            /*this.fetch({
                success: _.bind(function() {
                    //window.location('#home');
                    this.trigger('success');
                }, this),
                errors: _.bind(function() {
                    //window.location('#home');
                    this.trigger('errors');
                }, this)
            });*/

		},

        parse: function(response) {
            return response;
        },

		url: function() {
			var config = this.reqres.request('config');
			return config.restUrl + '/student';
		},
        validate: function(attrs, options){

            if(!attrs.personal_statement){
                return 'Personal statement is a required field.';
            }
            if(!attrs.personal_statement.length > 1000 ){
                return 'Personal statement must be 1000 characters or fewer.';
            }
           /* if(!attrs.personal_statement.match(/^[a-zA-Z0-9 ,.?!]+$/)) {
                return 'Personal statement may only contain letters and/or numbers';
            }*/

            if(!attrs.video_url){
                return 'Video URL is a required field.';
            }
        }
	});

	return PersonalStatement;
});