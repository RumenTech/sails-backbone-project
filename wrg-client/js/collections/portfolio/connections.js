define([
    'backbone',
    'models/connection'
], function(Backbone, Connection) {

    var Connections = Backbone.Collection.extend({
        model: Connection,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/connection/me' ;
        }
    });

    return Connections;
});
