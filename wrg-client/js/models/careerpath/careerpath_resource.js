/**
 * Created by semir.sabic on 21.4.2014.
 */
define(['backbone'], function(Backbone) {

    var CareerPathResource = Backbone.Model.extend({

        initialize: function(attributes, options) {
            if (options.reqres) {
                this.reqres = options.reqres;
                this.config = this.reqres.request('config');
                this.session = this.reqres.request('session');
            }
        },

        parse: function(response) {
            return response;
        },

        urlRoot: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/careerpathresource';
        },

        validate: function(attrs) {
            if(!attrs.title) {
                return 'You need to add title';
            }
            if(!attrs.content) {
                return 'You need to add description';
            }
            if(!attrs.cp_tab_category_id) {
                return 'You need to choose resource category';
            }
        }
    });

    return CareerPathResource;
});