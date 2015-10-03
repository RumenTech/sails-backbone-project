"use strict";


define([
    'backbone',
    'models/college/media_model'
], function(Backbone, Media) {

    var MediaCollection = Backbone.Collection.extend({
        model: Media,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');

            this._meta = {};
        },

        meta: function(prop, value) {
            if (value === undefined) {
                return this._meta[prop]
            } else {
                this._meta[prop] = value;
            }
        },

        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl + '/collegemedia'
        }
    });

    return MediaCollection;
});