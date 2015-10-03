/**
 * Created by Mistral on 2/19/14.
 */
define(['backbone'], function(Backbone) {

    var GroupEvent = Backbone.Model.extend({

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
            return config.restUrl  + '/groupevent';
        }
    });

    return GroupEvent;
});

