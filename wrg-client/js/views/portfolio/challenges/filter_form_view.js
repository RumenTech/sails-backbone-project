define([
    'marionette',
    'text!templates/portfolio/challenges/filter_form.html',
    'collections/portfolio/challenges',
    'models/portfolio/challenge',
    'lib/backbone.modelbinder'
], function (Marionette, Template, ChallengesCollection, Challenge, ModelBinder) {
    'use strict';

    var FilterFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .button.filter': 'filter',
            'keypress #challengesearch': function (e) {
                this.keyManager(e);
            },
            'keypress #location': function (e) {
                this.keyManager(e);
            }
        },

        bindings: {
            'challengesearch': '#challengesearch',
            'location': '#location'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Challenge(params.data, params);
            }
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        filter: function () {
            // Get the general search keyword.
            this.trigger('filter', this, this.model);
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.model.set('challengesearch', $('#challengesearch').val());
                this.model.set('location', $('#location').val());
                this.filter();
            }
        }
    });
    return FilterFormView;
});
