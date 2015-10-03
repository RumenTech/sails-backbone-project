/**
 * Created with JetBrains PhpStorm.
 * User: miguel
 * Date: 17/11/13
 * Time: 23:16
 * To change this template use File | Settings | File Templates.
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
            this.on('add', _.bind(this.onAdd, this));
            var limit ='';
            if (attributes === 'payment') {
                limit = 'ALL';
            }
            this.fetch({
                data: {limit: limit},
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });

        },
        fetching : function(){
            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });
        },
        onAdd: function(model) {
            //model.set('user_id', this.session.id);
        },
        parse: function(response) {
            return response.request;
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/company/friends' ;
        }
    });

    return friend;

});