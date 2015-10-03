/**
 * Created by Mistral on 1/22/14.
 */
define([
    'marionette',
    'text!templates/portfolio/jobs/jobs_index.html',
    'regions/modal_region',
    'models/portfolio/student',
    'views/portfolio/jobs/jobs_compositeview',
    'views/portfolio/jobs/filter_form_view',
    'collections/portfolio/jobs',
    'views/messages/sponsors_view'
], function (Marionette, Template, ModalRegion, Company, JobsCompositeView, FilterFormView, JobsCollection, SponsorsView) {
    'use strict';

    var JobsIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            jobsPosted: '#jobs-posted',
            filterForm: '#filter-form-section',
            sponsors: '#sponsors-section'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.model = new Company(null, options);
            this.jobs = new JobsCollection(null, {reqres: this.reqres});
            this.model.on('loaded', this.render, this);
            this.config = this.reqres.request('config');
            this.listenTo(this.model, 'loaded', this.onLoaded, this);

            var config = this.reqres.request('config');
            $("#pageloader").fadeIn(config.spinnerTimeout).delay(config.spinnerTimeout).fadeOut(config.spinnerTimeout);
        },

        onRender: function () {
            $('body').css('visibility', 'visible');
        },

        onLoaded: function () {
            this.filterForm.show(new FilterFormView({
                reqres: this.reqres,
                collection: this.model.get('jobs')
            }));

            this.jobsPosted.show(new JobsCompositeView({
                reqres: this.reqres,
                data: this.jobs
            }));

            this.sponsors.show(new SponsorsView());

            this.listenTo(this.filterForm.currentView, 'filter', this.onFilter, this);
            this.listenTo(this.jobsPosted.currentView, 'showModal itemview:showModal', this.showPostJobs, this);
        },

        onFilter: function (view, model) {
            this.jobs.reset();
            this.jobs.fetch({ data: $.param({
                jobsearch: model.get('jobsearch'),
                location: model.get('location'),
                applied: model.get('applied')})
            });

            this.jobsPosted.close();
            this.jobsPosted.show(new JobsCompositeView({
                reqres: this.reqres,
                data: this.jobs
            }));
        },

        showPostJobs: function (view, formClass, collection) {
            var options = {
                model: view.model,
                collection: this.collection,
                reqres: this.reqres,
                company: this.model
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({collection: collection, model: view.model, company_id: view.model.company_id, reqres: this.reqres}, options));
        }
    });
    return JobsIndexView;
});