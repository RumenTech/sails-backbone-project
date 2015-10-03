/**
 * Created by semir.sabic on 29.4.2014.
 */
define(['backbone'], function(Backbone) {

    var Feed = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.reqres;
        },

        parse: function(response) {
            return response;
        },

        urlRoot: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/feed';
        }
    });

    return Feed;
});