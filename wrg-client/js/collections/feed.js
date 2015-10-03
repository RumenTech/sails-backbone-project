/**
 * Created by semir.sabic on 29.4.2014.
 */
define([
    'backbone',
    'models/feed'
], function(Backbone, Feed) {

    var FeedCollection = Backbone.Collection.extend({
        model: Feed,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/feed/getfeed'
        }
    });

    return FeedCollection;
});