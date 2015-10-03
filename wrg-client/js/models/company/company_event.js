/**
 * Created by Mistral on 12/30/13.
 */
define(['backbone'], function(Backbone) {

    var CompanyEvent = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/companyevent';
        }
    });

    return CompanyEvent;
});
