define([
    'backbone',
    'models/company/talent'
], function(Backbone, friend) {
    var friend = Backbone.Collection.extend({
        model: friend,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.on('add', _.bind(this.onAdd, this));
            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });
        },
        onAdd: function(model) {
        },
        parse: function(response) {
            return response.request;
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/talent/friends' ;
        }
    });

    return friend;

});