/*
This collection is extended with ability to add meta property to collection
  get property: var a = this.collection.meta("currentPosition");
  set property:        this.collection.meta("currentPosition", something)
 */
"use strict";

define([
    'backbone',
    'models/groups/media_model'
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
            return  config.restUrl + '/groupmedia'
        }
    });

    return MediaCollection;
});