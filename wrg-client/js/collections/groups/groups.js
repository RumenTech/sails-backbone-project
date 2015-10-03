define([
    'backbone',
    'models/groups/group'
], function(Backbone, Group) {

    var GroupsCollection = Backbone.Collection.extend({
        model: Group,

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
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/group/searchGroup';
        }
    });

    return GroupsCollection;
});

