/**
 * Created by Mistral on 2/13/14.
 */

define([
    'backbone',
    'models/receiver'
], function(Backbone, Receiver) {

    var ReceiversCollection = Backbone.Collection.extend({
        model: Receiver,

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
            return response.request;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/message/searchReceivers';
        }
    });

    return ReceiversCollection;
});

