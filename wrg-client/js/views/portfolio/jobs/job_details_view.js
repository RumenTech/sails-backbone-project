/**
 * Created by semir.sabic on 3/11/14.
 */
define([
    'marionette',
    'regions/modal_region',
    'text!templates/portfolio/jobs/job_details.html',
    'models/company/job_details',
    'models/company/job_application',
    'lib/backbone.modelbinder',
    'views/messages/sponsors_view',
    'views/portfolio/jobs/job_application_view',
    'underscore'
], function (Marionette, ModalRegion, Template, Model, JobApplicationModel, ModelBinder, SponsorsView, JobApplicationView, _) {
    'use strict';

    var JobDetailsView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click #backToJobs': 'backToJobs',
            'click #button-apply': 'applyToJob',
            'click #facebookshare': function (e) {
                e.preventDefault();
                e.stopPropagation();
                var jobLink = window.location.href; //localhost links are not working with the Share. Must be IP or domain name

                _.delay(function () {
                    Hull.api({ provider: 'facebook', path: 'ui.share' }, { href: jobLink });
                }, 1);
            }
        },

        regions: {
            modal: ModalRegion,
            sponsors: '#sponsors-section'
        },

        initialize: function (options) {

            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.config = this.reqres.request('config');
            this.modelBinder = new ModelBinder();
            var parameters = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.jobId = parameters.split('_')[0];
            var returnPoint = parameters.split('_')[1];
            this.model = new Model(this.jobId, options);
            this.model.set('returnPoint', returnPoint);

            this.model.on('loaded', this.render, this);
            this.listenTo(this.model, 'error', this.onErrorMethod, this);
            this.checkIfApplied();
        },

        shareOnFacebook: function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            //alert(window.location.href);
            var link = window.location.href;
            /* var a =  _.delay(function() {
             Hull.api({ provider: 'facebook', path: 'ui.share' }, { href: link });
             });*/
        },

        checkIfApplied: function () {
            var that = this;
            $.ajax({
                type: 'get',
                url: this.config.restUrl + '/jobapplication/checkIfUserApplied',
                data: $.param({
                    job_id: this.jobId,
                    applicant_id: that.model.session.id
                }),
                dataType: 'json',
                success: function (data) {
                    if (data.message === 'You have already applied') {
                        that.model.set('applied', 'APPLIED');
                        that.render();
                    }
                }
            });
        },

        onRender: function () {
            $("#pageloader").hide();
            $('body').css('visibility', 'visible');

            this.sponsors.show(new SponsorsView());
        },

        onErrorMethod: function () {
            $('#error').css('display', 'block');
        },

        backToJobs: function () {
            if (this.model.get('returnPoint') === 'company') {
                window.location = '#company/' + this.model.get('company_id');
            }
            else {
                window.location = '#jobs_student';
            }
        },

        onShow: function () {
            //Animate Apply Link
            setTimeout(function () {
                $("#application-link").show().addClass("animated bounceInLeft flash");
            }, 1300);
        },

        applyToJob: function () {
            this.modal.show(new JobApplicationView({
                job_id: this.jobId,
                applicant_id: this.session.id,
                collection: this.collection,
                reqres: this.reqres
            }));
        }
    });
    return JobDetailsView;
});