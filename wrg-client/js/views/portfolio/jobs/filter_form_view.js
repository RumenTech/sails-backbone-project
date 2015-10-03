define([
    'marionette',
    'text!templates/portfolio/jobs/filter_form.html',
    'collections/portfolio/jobs',
    'models/portfolio/job',
    'lib/backbone.modelbinder'
], function (Marionette, Template, JobsCollection, Job, ModelBinder) {
    'use strict';

    var FilterFormView = Marionette.ItemView.extend({
        template: Template,

        events: {
            'click .button.filter': 'filter',
            'click .button.applied': 'filterApplied',
            'click #applied': function () {
                if ($('#applied').is(':checked')) {
                    this.filterApplied();
                } else {
                    this.filter();
                }
            },
            'keypress #jobsearch': function (e) {
                this.keyManager(e);
            },
            'keypress #location': function (e) {
                this.keyManager(e);
            }
        },

        bindings: {
            'jobsearch': '#jobsearch',
            'location': '#location'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Job(params.data, params);
            }
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        filter: function () {
            this.model.unset('applied');
            this.trigger('filter', this, this.model);
        },

        filterApplied: function () {
            this.model.set('applied', 'true');
            this.trigger('filter', this, this.model);
        },

        keyManager: function (e) {
            if (e.which === 13) {
                this.model.set('jobsearch', $('#jobsearch').val());
                this.model.set('location', $('#location').val());
                this.filter();
            }
        }
    });
    return FilterFormView;
});
