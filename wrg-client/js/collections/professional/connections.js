define([
    'backbone',
    'models/connection'
], function(Backbone, Connection) {

    var Connections = Backbone.Collection.extend({
        model: Connection,

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
        parse: function(response) {
            return response;
        },
        onAdd: function(model) {
            //model.set('user_id', this.session.id);
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/connection/me' ;
        }
    });

    return Connections;
});