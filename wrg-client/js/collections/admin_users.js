define([
    'backbone',
    'models/admin_user'
], function(Backbone, AdminUser) {

    var AdminUsersCollection = Backbone.Collection.extend({
        model: AdminUser,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.fetch({
                data: {export: false, limit: 100},
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/dbparser/detailview'
        }
    });

    return AdminUsersCollection;
});