define(['backbone'], function(Backbone) {

    var BasicInformation = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.id = this.session.id;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/college';
        },

        validate: function(attrs, options) {
            if(!attrs.description > 500 ) {
                return 'Description must be 50 characters or fewer.';
            }
            if(attrs.tagline) {
                if(attrs.tagline.length > 50) {
                    return 'Tagline must be 50 characters or fewer';
                }
            }
        }
    });

    return BasicInformation;
});
