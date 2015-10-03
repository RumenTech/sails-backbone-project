/**
 * Created by semir.sabic on 3/11/14.
 */
define([
    'marionette',
    'text!templates/portfolio/jobs/job_details.html',
    'models/company/job_details',
    'collections/company/applicants',
    'lib/backbone.modelbinder',
    'views/messages/sponsors_view',
    'views/company/jobs/applicants_compositeview'
], function (Marionette, Template, Model, ApplicantsCollection, ModelBinder, SponsorsView, ApplicantsCompositeView) {
    "use strict";

    var JobDetailsView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #backToJobs': 'backToJobs'
        },

        regions: {
            sponsors: '#sponsors-section',
            applicants: '#applicants-section'
        },

        initialize: function (options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var jobId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new Model(jobId, options);

            this.applicantsCollection = new ApplicantsCollection(jobId, options);
            this.applicantsCollection.on('loaded', this.onRenderApplicants, this);

            this.model.on('loaded', this.render, this);
            this.listenTo(this.model, 'error', this.onErrorMethod, this);
        },

        onRender: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
            this.sponsors.show(new SponsorsView());
            $('#button-apply').hide();
        },

        onRenderApplicants: function () {

            this.applicants.show(new ApplicantsCompositeView({
                reqres: this.reqres,
                data: this.applicantsCollection,
                company: this.model
            }));
        },

        onErrorMethod: function () {
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('#error').css('display', 'block');
        },

        backToJobs: function () {
            window.location = '#jobs';
        }
    });
    return JobDetailsView;
});
