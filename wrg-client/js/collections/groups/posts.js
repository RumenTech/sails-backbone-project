"use strict";
define([
    'backbone',
    'models/groups/post'
], function (Backbone, Post) {

    var PostsCollection = Backbone.Collection.extend({
        model: Post,

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.session = this.reqres.request('session');
            this.fetch({
                data: $.param({ id: attributes}),
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this),
                error: _.bind(function(err) {
                    this.trigger('error');
                }, this)
            });
        },

        parse:function (response) {
            return response;
        },

        url:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/grouppost/getposts';
        },

        validate:function (attrs, options) {

        }
    });

    return PostsCollection;
});


