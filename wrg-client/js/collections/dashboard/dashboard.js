define([
    'backbone',
    'models/dashboard/dashboard'
], function (Backbone, Dashboard) {

    var DashboardCollection = Backbone.Collection.extend({
        model: Dashboard,

        initialize: function (attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                type: 'GET',
                dataType: 'json',
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/dashboard/getalldashboarddata';
        }
    });

    return DashboardCollection;
});