"use strict";

define([
    'backbone',
    'models/groups/group_user'
], function (Backbone, Event) {

    var GroupUsersCollection = Backbone.Collection.extend({
        model: Event,

        initialize: function (attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.config = this.reqres.request('config');
            var groupId = params.group_id;
            if(params.user_id) {
                this.fetch({
                    type: 'GET',
                    data: $.param({ group_id: groupId}),
                    url: this.config.endPoints.userPendingResolution,
                    dataType: 'json',
                    success: _.bind(function(data) {
                        this.trigger('loaded');
                    }, this),
                    error: _.bind(function(err) {
                        this.trigger('error');
                    }, this)
                });
            }
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/groupuser';
        }
    });

    return GroupUsersCollection;
});