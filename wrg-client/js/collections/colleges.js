/**
 * Created by semir.sabic on 3/20/14.
 */
define([
    'backbone',
    'models/friend'
], function(Backbone, friend) {
    var friend = Backbone.Collection.extend({
        model: friend,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        fetching : function(){
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
            return config.restUrl + '/college/friends' ;
        }
    });

    return friend;

});
