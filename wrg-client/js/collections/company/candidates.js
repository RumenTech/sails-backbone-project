"use strict";

define([
    'backbone',
    'models/company/candidate'
], function (Backbone, Candidate) {

    var CandidatesCollection = Backbone.Collection.extend({
        model: Candidate,

        initialize: function (attributes, params) {

            //TODO add defense for IE8
            if(typeof attributes === "undefined") { return; }
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        onAdd: function (model) {

        },

        url: function () {
            var config = this.reqres.request('config');
            return  config.restUrl + '/candidate'
        }
    });

    return CandidatesCollection;
});
