define(['backbone'], function(Backbone) {

    var DashboardModel = Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.reqres = options.collection.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/dashboard';
        }
    });

    return DashboardModel;
});

