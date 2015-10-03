define([
    'backbone',
    'models/groups/group'
], function(Backbone, Group) {

    var GroupSettingsCollection = Backbone.Collection.extend({
        model: Group,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        parse: function(response) {
            return response;
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/group';
        }
    });

    return GroupSettingsCollection;
});

